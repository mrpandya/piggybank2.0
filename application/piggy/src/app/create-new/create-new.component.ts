import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Token,CreateNewService } from './create-new.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.css']
})

export class CreateNewComponent implements OnInit {
  createForm:any;
  data:any;
  user:Token;
  constructor(
    // injecting the FormBuilder
    private formBuilder:FormBuilder,
    private createNewService:CreateNewService,
    private sessionService:SessionService,
  ) {
    this.createForm=this.formBuilder.group({
      username: '',
      password: '',
    });
   }

  ngOnInit(): void {
  }

  // it is called when the submit button is clicked
  create(user:any){
    // it resets the form
    this.createForm.reset();
    this.createNewService.createNew(user).subscribe(resp=>{
      this.data={...resp};
      // if the user exists then send a window alert and reset the form
      if(resp.username==='doesExist'&&resp.password=='400'){
        window.alert('user already exists');
        this.createForm.reset();
        return;
      }
      // to create the session username once the response is a success and alert the user
      this.sessionService.createSession(user.username);
      window.alert('user has been created');
    });
  }
}
