import { Component, Input, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthState } from '../../../auth_managment/authentification-store/states/auth.state';
import { ActivatedRoute, Router } from '@angular/router';

import { SubmittedPollution } from '../../classes/submittedPollution/submitted-pollution';
import { PollutionRecap } from '../pollution-recap/pollution-recap';
import { PollutionAPI } from '../../services/pollution-api';
import { POLLUTION_TYPES } from '../../classes/submittedPollution/submitted-pollution';

@Component({
  selector: 'app-form-delcaration-pollution',
  imports: [ReactiveFormsModule, PollutionRecap],
  templateUrl: './form-delcaration-pollution.html',
  styleUrl: './form-delcaration-pollution.scss'
})
export class FormDelcarationPollution implements OnInit {

  
  private readonly store = inject(Store);

  pollution ? : SubmittedPollution

  submitted : boolean = false
  isEditMode : boolean = false
  loading : boolean = false
  photoBase64: string | null = null
  readonly pollutionTypes = POLLUTION_TYPES;
  
  readonly pollutionForm = new FormGroup({
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


  ngOnInit(): void {
    this.loadPollutionIfEditing();
  }


  onSubmit()
  {
    if (this.loading) return;
    this.loading = true;

    const prepared = this.preparePollutionFromForm();
    this.pollution = prepared;

    if (this.isEditMode) {
      const id = this.getPollutionIdFromRoute();
      if (id != null) prepared.id = id;
      this.attachPhotoAndUser(prepared);
      this.submitEdit(prepared);
    } else {
      this.attachPhotoAndUser(prepared);
      this.submitCreate(prepared);
    }
  }


  private getPollutionIdFromRoute(): number | null {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (!idStr) return null;
    const id = parseInt(idStr, 10);
    return Number.isNaN(id) ? null : id;
  }

  private loadPollutionIfEditing() {
    const pollutionId = this.getPollutionIdFromRoute();
    if (!pollutionId) return;

    this.isEditMode = true;
    this.pollutionApi.getPollutionById(pollutionId).subscribe(found => {
      this.pollution = found;
      this.applyPollutionToForm(found);
    });
  }

  private applyPollutionToForm(p: SubmittedPollution) {
    const formValue = {
      id: p.id?.toString(),
      titre: p.titre,
      type_pollution: p.type_pollution,
      description: p.description,
      date_observation: p.date_observation?.toString(),
      lieu: p.lieu,
      longitude: p.longitude?.toString(),
      latitude: p.latitude?.toString()
    };
    this.pollutionForm.patchValue(formValue);
  }

  private preparePollutionFromForm(): SubmittedPollution {
    return Object.assign(new SubmittedPollution(), this.pollutionForm.value);
  }

  private attachPhotoAndUser(pollution: SubmittedPollution) {
    if (this.photoBase64) pollution.photo_base64 = this.photoBase64;
    const currentUser = this.store.selectSnapshot(AuthState.getUser);
    if (currentUser && currentUser.id) pollution.userId = currentUser.id;
  }

  private submitEdit(pollution: SubmittedPollution) {
    this.pollutionApi.putPollution(pollution).subscribe({
      next: response => {
        console.log('Pollution updated:', response);
        this.submitted = true;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: err => {
        console.error('Error updating pollution:', err);
        this.loading = false;
      }
    });
  }

  private submitCreate(pollution: SubmittedPollution) {
    this.pollutionApi.postPollution(pollution).subscribe({
      next: response => {
        console.log('Pollution created:', response);
        this.submitted = true;
        this.cdr.detectChanges();
        this.loading = false;
      },
      error: err => {
        console.error('Error creating pollution:', err);
        this.loading = false;
      }
    });
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
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  previewSrc(): string | null {
    return this.photoBase64 ?? (this.pollution ? this.pollution.photo_base64 ?? null : null);
  }







  
  cancel() {
    this.router.navigate(['/']);
  }

}




