import { Component, Input, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { ActivatedRoute, Router } from '@angular/router';

import { SubmittedPollution } from '../../classes/submittedPollution/submitted-pollution';
import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { PollutionAPI } from '../../services/pollution-api';
import { POLLUTION_TYPES, PollutionType } from '../../classes/submittedPollution/submitted-pollution';

@Component({
  selector: 'app-form-delcaration-pollution',
  imports: [ReactiveFormsModule, PollutionRecap],
  templateUrl: './form-delcaration-pollution.html',
  styleUrl: './form-delcaration-pollution.scss'
})
export class FormDelcarationPollution implements OnInit {

  pollution ? : SubmittedPollution

  submitted : boolean = false
  isEditMode : boolean = false
  loading : boolean = false
  photoBase64: string | null = null
  pollutionTypes = POLLUTION_TYPES;
  
  pollutionForm = new FormGroup({
    // Validators.required -> oblige re remplir le formulaire, d'une certaine manière
    // le bouton submt n'est pas utilisable tant que ce n'est pas valide
    titre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type_pollution: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    date_observation: new FormControl('', [Validators.required]),
    lieu: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required, Validators.min(-180), Validators.max(180)]),
    latitude: new FormControl('', [Validators.required, Validators.min(-90), Validators.max(90)])
  })


  constructor
  (
    private pollutionApi : PollutionAPI,
    private route : ActivatedRoute,
    private router : Router,
    private cdr: ChangeDetectorRef 
  ) 
  {
    //
  }

  // inject store for user info
  private store = inject(Store);


  ngOnInit() 
  {

    // On verifie si on as un id dans l'url
    const pollutionId : number = parseInt(this.route.snapshot.paramMap.get('id')!)
    
    if (pollutionId) 
    {

      // si on en as un, on est en mode edition
      this.isEditMode = true;

      this.pollutionApi.getPollutionById(pollutionId)
      .subscribe(
        foundPollution => 
        {

          this.pollution = foundPollution;

          // on récupère les données de l'objet pollution
          const formValue = 
          {
            id: this.pollution.id.toString(),
            titre: this.pollution.titre,
            type_pollution: this.pollution.type_pollution,
            description: this.pollution.description,
            date_observation: this.pollution.date_observation.toString(),
            lieu: this.pollution.lieu,
            longitude: this.pollution.longitude.toString(),
            latitude: this.pollution.latitude.toString()
          };

          this.pollutionForm.patchValue(formValue); // et on les ajoutes dans le formulaire pour le pré remplir
        }
      );
    }
    // si on as pas d'id, on reste en mode creation (isEditMode reste a false)

  }


  onSubmit()
  {
    if (!this.loading)
    {
      this.loading = true
      this.pollution = Object.assign(new SubmittedPollution(), this.pollutionForm.value)
    
      if (this.isEditMode && this.pollution) // si on est en mode edition
      {
        // Récupérer l'ID depuis l'URL (pas depuis le formulaire)
        const pollutionId = parseInt(this.route.snapshot.paramMap.get('id')!);
        this.pollution.id = pollutionId; 
        
        // attach base64 image if provided
        if (this.photoBase64 && this.pollution) {
          this.pollution.photo_base64 = this.photoBase64;
        }

        // attach current user id if available
        const currentUser = this.store.selectSnapshot(AuthState.getUser);
        if (currentUser && currentUser.id && this.pollution) {
          this.pollution.userId = currentUser.id;
        }

        this.pollutionApi.putPollution(this.pollution).subscribe({
          next: (response) => {
            console.log('Pollution updated:', response);
            this.submitted = true;
            this.cdr.detectChanges(); // détection des changements pour que submitted mette à jour l'affichage
            this.loading = false
          },
          error: (error) => {
            console.error('Error updating pollution:', error)
            this.loading = false
          }
        });
      }
      else  // sinon, on est en creation
      {
        // Ne pas générer l'ID manuellement, laissez la base de données le faire (autoIncrement)
        // attach base64 image if provided
        if (this.photoBase64 && this.pollution) {
          this.pollution.photo_base64 = this.photoBase64;
        }

        // attach current user id if available
        const currentUser = this.store.selectSnapshot(AuthState.getUser);
        if (currentUser && currentUser.id && this.pollution) {
          this.pollution.userId = currentUser.id;
        }

        this.pollutionApi.postPollution(this.pollution).subscribe({
          next: (response) => {
            console.log('Pollution created:', response);
            this.submitted = true;
            this.cdr.detectChanges(); // détection des changements pour que submitted mette à jour l'affichage
            this.loading = false
          },
          error: (error) => {
            console.error('Error creating pollution:', error)
            this.loading = false
          }
        });
      }
    }
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.compressImage(file, 1024, 0.7)
      .then(dataUrl => {
        this.photoBase64 = dataUrl;
        this.cdr.detectChanges();
      })
      .catch(err => {
        console.error('Image compression failed', err);
      });
  }

  private compressImage(file: File, maxDimension = 1024, quality = 0.7): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            const ratio = width / height;
            if (ratio > 1) {
              width = maxDimension;
              height = Math.round(maxDimension / ratio);
            } else {
              height = maxDimension;
              width = Math.round(maxDimension * ratio);
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas not supported'));
          ctx.drawImage(img, 0, 0, width, height);
          // convert to jpeg to reduce size
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // returns a source for preview: either the newly selected base64 or existing photo_base64 from server
  previewSrc(): string | null {
    return this.photoBase64 ?? (this.pollution ? this.pollution.photo_base64 ?? null : null);
  }







  
  cancel() {
    this.router.navigate(['/']);
  }

}




