import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _user:string;
  constructor(){
    this._user='manan';
  }
  createSession(user:string){
    this._user = user;
  }
  getUser():string{
    return this._user;
  }
}
