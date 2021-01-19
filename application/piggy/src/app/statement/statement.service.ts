import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,retry } from 'rxjs/operators';

//create an interface called transaction which holds the value of one transaction
export interface Transaction{
  balance:string;
  last_transaction:string;
};

// this interface holds the indexed list of transactions
export interface Statement{
  [index:number]:Transaction;
}

@Injectable({
  providedIn: 'root'
})
export class StatementService {
  constructor(
    // injecting the HttpClient as http
    private http : HttpClient,
  ) {}

  // this function gets the statement of a user
  getStatement(user:string):Observable<HttpResponse<Statement>> {
    // appending the user's name at the end to create the necessary query
    var url = 'http://0.0.0.0:8085/api/statement/'+user;
    // returning the response we get from the above url
    return this.http.get<Statement>(url,{observe:'response'})
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
