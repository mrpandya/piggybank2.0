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
  temp:any={};
  error:Boolean=false;
  post:Withdraw;
  username : string;
  constructor(
    // injecting the form builder and the withdraw service
    private formBuilder: FormBuilder,
    private withdrawService: WithdrawService,
    private sessionService: SessionService,
  ) {
    // to get the username from the session storage
    this.username = sessionStorage.getItem('username');
    this.withdrawForm = this.formBuilder.group({
      amount : '',
    })
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('username')==undefined){
      window.location.replace('/');
    }else{
      document.getElementById("withdraw").classList.add("active");
    }
  }

  // function to withdraw the money
  withdraw(data:Withdraw){
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
      return;
    });
    // if the server return a 400 this.temp has a property called closed which is false
    // the server will return a 400 if there is a wrong input or more money is withdrawn
    // if(!this.temp.closed){
    //   window.alert("wrong input please try again or check your balance for insufficent funds");
    // }
  }
  onclick(){
    if(this.temp!=undefined){
      this.error=true;
    }
  }

}
