import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SubmittedPollution } from '../../classes/submittedPollution/submitted-pollution';
import { UserApi } from '../../../user_managment/services/userApi/user-api';

@Component({
  selector: 'app-pollution-recap',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.scss'
})
export class PollutionRecap implements OnInit {

  @Input({ required: true }) pollution!: SubmittedPollution
  @Input({ required: false }) isRecap: boolean = false 

  showDetail: boolean = false
  username$?: Observable<string | null>

  constructor(
    private router: Router,
    private userApi: UserApi
  ) {
    //
  }

  ngOnInit() {
    if (this.pollution.userId) {
      this.username$ = this.userApi.getUserById(this.pollution.userId).pipe(
        map(user => user.username),
        catchError(() => of(null))
      );
    } else {
      this.username$ = of(null);
    }
  }

  changeShowDetail(show: boolean) {
    this.showDetail = show
  }

  cancel() {
    this.router.navigate(['/']);
  }
  
}