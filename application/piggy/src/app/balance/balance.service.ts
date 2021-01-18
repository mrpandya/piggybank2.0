import { Injectable } from '@angular/core';
import  { HttpClient, HttpErrorResponse, HttpResponse,HttpHeaders } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// interface of a type in which the response is going to be received
export interface Balance{
  balance : string;
  user : string;
};
let headers: HttpHeaders = new HttpHeaders();
@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  constructor(
    // injecting the HttpClient
    private http: HttpClient,
  ) {
   }

   // to get the balance of the user
    getBalance(user:string): Observable<HttpResponse<Balance>>{
      var url = "http://0.0.0.0:8085/api/balance/"+user;
      console.log(url);
      return this.http.get<Balance>(url,{observe:'response',headers:headers})
      .pipe(
        catchError(this.handleError)
      );
    }


    private handleError(error:HttpErrorResponse){
      if(error.error instanceof Error){
        console.error('An error occured : '+error.error.message);
      }
      else{
        console.error(
          `Backend returned code ${error.status}`+
          `Body was ${error.error}`
        );
      }
      return throwError(
        'somethng bad happened please try again later'
      );
    }
  
}
