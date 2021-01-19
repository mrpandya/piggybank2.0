import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// its object will hold the authentication data ie the credentials of the user for verification
export interface Token{
  'username': string,
  'password': string,
}
// its object will hold the response we get from the server
export interface response{
  'login':Boolean,
}

@Injectable({
  providedIn: 'root'
})
export class SigninService {

  constructor(
    //injecting the HttpClient as http
    private http: HttpClient
  ) { }

  // it will send a post request for verification of the user's given credentials
  onSubmit(token:Token):Observable<response>{
    return this.http.post<response>('http://0.0.0.0:8085/api/authenticate',token);
  }
}


