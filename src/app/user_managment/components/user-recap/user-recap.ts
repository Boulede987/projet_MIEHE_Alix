import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../classes/user/user';

@Component({
  selector: 'app-user-recap',
  imports: [],
  templateUrl: './user-recap.html',
  styleUrl: './user-recap.scss'
})
export class UserRecap {
  
  @Input({ required: true }) user ! : User
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
