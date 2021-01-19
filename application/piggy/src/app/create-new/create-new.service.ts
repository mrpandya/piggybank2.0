import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// creating a header response to pass along with the request
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

// interfaces object will hold information about the users authentication
export interface Token{
  'username': string,
  'password': string,
}

@Injectable({
  providedIn: 'root'
})
export class CreateNewService {

  constructor(
    // injecting HttpClient
    private http: HttpClient,
  ) { }

  // it sends a post request with the response 
  createNew(user:Token):Observable<any|Token>{
    return this.http.post<any|Token>("http://0.0.0.0:8085/api/create",user,httpOptions);
  }

}

