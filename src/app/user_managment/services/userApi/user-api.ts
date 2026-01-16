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

  // public getUserById (id : number) : Observable<User> 
  // {
  //   // besoin de connaissance des routes qu'utilise l'api -> tight coupling
  //   return this.http.get<User>(`${environment.listUsers}/${id}`)
  // }


  public postUser (user : User) : Observable<User> 
  {
    return this.http.post<User>(environment.listUsers, user)
  }



  // public putUser (user : User) : Observable<User> 
  // {
  //   return this.http.put<User>(`${environment.listUsers}/${user.id}`, user)
  // }



  // public deleteUser(user: User): Observable<User>  
  // {
  //   return this.http.delete<User>(`${environment.listUsers}/${user.id}`);
  // }

  public userLogin(email: string, password: string): Observable<User> {
    return this.http.post<User>(environment.loginUser, { email, password });
  }
}
