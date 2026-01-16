import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SubmittedPollution } from '../../classes/submittedPollution/submitted-pollution';

@Component({
  selector: 'app-pollution-recap',
  imports: [DatePipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.scss'
})
export class PollutionRecap {

  @Input({ required: true }) pollution ! : SubmittedPollution
  @Input({ required: false }) isRecap : boolean = false 

  showDetail : boolean = false

  constructor
  (
    private router: Router
  )
  {
    //
  }

  changeShowDetail(show : boolean)
  {
    this.showDetail = show
  }

  cancel() {
    this.router.navigate(['/']);
  }
  
}
