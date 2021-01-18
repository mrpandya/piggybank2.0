import { Component, OnInit } from '@angular/core';
import { Balance,BalanceService } from './balance.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  providers: [BalanceService],
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {
  data:any|Balance;
  username:string;
  if404:Boolean=false;
  constructor(
    private balanceService:BalanceService,
    private sessionService:SessionService,
  ) {
    // getting the username of the user who is currently logged in
    this.username=this.sessionService.getUser();
    this.data={'user':this.username,'balance':'-'};
  }

  // to show balance on init (load)
  ngOnInit() {
   this.showBalance();
  }

  // to check for the data fetched by the balanceService and assigning vars accordingly
  showBalance() {
    var temp=this.balanceService.getBalance(this.username)
    .subscribe(resp=>{
      this.data=resp.body;
      if(resp.status==200){
        this.if404=false;
      }
    });
    if(!temp.closed){
      this.if404=true;
    }
  }
}
