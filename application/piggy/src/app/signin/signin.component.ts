import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { StorageService } from 'ngx-webstorage-service';

import { response,Token,SigninService } from './signin.service';
import { SessionService } from '../session.service';

import { SetSession } from '../session';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm:any;
  token:Token;
  // session:SetSession;
  constructor(
    private formBuilder:FormBuilder,
    // private sessionService:SessionService,
    private signinService:SigninService,
    // private storage:StorageService,
  ) { 
    // declaring the elements of the form
    this.signinForm = this.formBuilder.group({
      username:'',
      password:'',
    })
    // this.session = new SetSession(this.storage);
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('username')){
      location.replace('/balance');
    }
  }
  // it will be called when the user clicks the singin button
  Signin(data:any|Token){
    this.signinForm.reset();
    this.signinService.onSubmit(data).subscribe(resp=>{
      // if the authentication fails
      if(!resp.login){
        window.alert('wrong input please try again');
      }
      // if the authentication succeeds
      else{
        // this.sessionService.createSession(data.username);
        // this.session.setSession('username',data.username);
        sessionStorage.setItem('username',data.username);
        // console.log(this.session.getSessionUser('username'));
        window.alert('login is successful');
        location.replace('/balance');
      }
    })
  }

}
