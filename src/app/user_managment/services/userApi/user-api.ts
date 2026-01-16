import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { User } from '../../classes/user/user';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserApi 
{
  constructor(private http:HttpClient) { }
  
  public getUsers () : Observable<User[]> 
  {
    return this.http.get<User[]>(environment.listUsers)
  }

  public postUser (user : User) : Observable<User> 
  {
    return this.http.post<User>(environment.listUsers, user)
  }

  public userLogin(email: string, password: string): Observable<User> {
    return this.http.post<User>(environment.loginUser, { email, password });
  }
}
