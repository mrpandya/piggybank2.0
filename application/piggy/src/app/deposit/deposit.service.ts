import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// deposit interface whose instance will hold the value of a transaction
export interface Deposit{
  "username": string;
  "amount" : string;
}

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  error:Deposit;
  constructor(
    private http : HttpClient,
  ) {
    this.error={"username":"","amount":"user not found please try again"};
  }
  
  onSubmit(user:any): Observable<Deposit>{
    var url = "http://0.0.0.0:8085/api/deposit";
    return this.http.post<Deposit>(url,user);
  }
}
