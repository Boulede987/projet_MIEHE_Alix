import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { SubmittedPollution } from '../classes/submittedPollution/submitted-pollution';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PollutionAPI {



  constructor(private http:HttpClient) { }



  public getPollutions (search?: string, type?: string) : Observable<SubmittedPollution[]> 
  {
    let params = new HttpParams();
    if (search) {
      params = params.set('q', search);
    }
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<SubmittedPollution[]>(environment.listPollution, { params })
  }

  public getPollutionById (id : number) : Observable<SubmittedPollution> 
  {
    return this.http.get<SubmittedPollution>(`${environment.listPollution}/${id}`)
  }


  public postPollution (pollution : SubmittedPollution) : Observable<SubmittedPollution> 
  {
    return this.http.post<SubmittedPollution>(environment.listPollution, pollution)
  }



  public putPollution (pollution : SubmittedPollution) : Observable<SubmittedPollution> 
  {
    return this.http.put<SubmittedPollution>(`${environment.listPollution}/${pollution.id}`, pollution)
  }



  public deletePollution(pollution: SubmittedPollution): Observable<SubmittedPollution>  
  {
    return this.http.delete<SubmittedPollution>(`${environment.listPollution}/${pollution.id}`);
  }
  
}
