import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse,HttpParams} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

// creating a header response to pass along with the request
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

// the instances of this interface holds the data of one transaction
export interface Withdraw{
  "username": string;
  "amount" : string;
}

@Injectable({
  providedIn: 'root'
})
export class WithdrawService {
  error:Withdraw;
  constructor(
    // injecting the HttpClient
    private http : HttpClient,
  ) {
    // initializing the error response
    this.error={"username":"","amount":"user not found please try again"};
  }
  
  // this function will be called when the withdraw button is clicked
  onSubmit(user:any): Observable<Withdraw>{
    // it sends a post request on the url
    var url = "http://0.0.0.0:8085/api/withdraw";
    return this.http.post<Withdraw>(url,user,httpOptions);
  }
}
