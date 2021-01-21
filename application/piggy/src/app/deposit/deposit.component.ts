import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Deposit, DepositService } from './deposit.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  depositForm:any;
  userData:any;
  response:any;
  temp:any;
  error:Boolean=false;
  post:Deposit;
  user:string;
  constructor(
    private formBuilder: FormBuilder,
    private depositService:DepositService,
  ) {
    // getting the username from the session storage
    this.user=sessionStorage.getItem('username');
    this.depositForm = this.formBuilder.group({
      amount : '',
    })
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('username')==undefined){
      window.location.replace('/');
    }
  }

  // to deposit the amount on click
  deposit(data:Deposit) {
    // to rest the form once the submit button is pressed
    this.depositForm.reset();
    this. post ={ "username":this.user, "amount":data.amount};
      this.temp = this.depositService.onSubmit(this.post)
    .subscribe(resp=>{
      this.error=false;
      this.response=resp;
      //alert message to notify the user if the amount is deposited successfully
      window.alert("you have successfully deposit Rs." + this.response.lastTransaction.substr(1,this.response.lastTransaction.length));
    });
  }
  onclick(){
    if(this.temp!=undefined){
      this.error=true;
    }
  }

}
