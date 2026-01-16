import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubmittedPollution } from '../../classes/submittedPollution/submitted-pollution';
import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { PollutionAPI } from '../../services/pollution-api';

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
  
  pollutionForm = new FormGroup({
    // Validators.required -> oblige re remplir le formulaire, d'une certaine manière
    // le bouton submt n'est pas utilisable tant que ce n'est pas valide
    titre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    type_pollution: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    date_observation: new FormControl('', [Validators.required]),
    lieu: new FormControl('', [Validators.required]),
    longitude: new FormControl('', [Validators.required, Validators.min(-180), Validators.max(180)]),
    latitude: new FormControl('', [Validators.required, Validators.min(-90), Validators.max(90)]),
    photo: new FormControl('')
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
            latitude: this.pollution.latitude.toString(),
            photo: this.pollution.photo_url
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







  
  cancel() {
    this.router.navigate(['/']);
  }

}




