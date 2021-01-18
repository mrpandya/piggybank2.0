import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Withdraw, WithdrawService } from './withdraw.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})

export class WithdrawComponent implements OnInit {
  withdrawForm;
  userData:any;
  response:any;
  temp:any;
  error:Boolean=false;
  post:Withdraw;
  username : string;
  constructor(
    // injecting the form builder and the withdraw service
    private formBuilder: FormBuilder,
    private withdrawService: WithdrawService,
    private sessionService: SessionService,
  ) {
    // to assign the username the currently logged in user's id
    this.username = this.sessionService.getUser();
    this.withdrawForm = this.formBuilder.group({
      amount : '',
    })
  }

  ngOnInit(): void {
  }

  // function to withdraw the money
  withdraw(data:Withdraw) {
    // it resets the form with null values
    this.withdrawForm.reset();
    // declaring the dict (map) with the data to send as a json request
    this.post ={ "username":this.username, "amount":data.amount};
    // passing the map object to the onSubmit function in withdrawService
      this.temp = this.withdrawService.onSubmit(this.post)
    .subscribe(resp=>{
      this.error=false;
      this.response=resp;
      // to alert the user that the withdraw is successful
      window.alert("you have successfully withdrawn Rs." + this.response.lastTransaction.substr(1,this.response.lastTransaction.length));
    });
  }
  onclick(){
    if(this.temp!=undefined){
      this.error=true;
    }
  }

}
