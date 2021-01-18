import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Transaction,Statement,StatementService } from './statement.service';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  providers:[StatementService],
  styleUrls: ['./statement.component.css']
})
export class StatementComponent implements OnInit {
  ifChecked:Boolean = true;
  username:any;
  if404:Boolean=false;
  statement:any|Statement;
  noUSER:any;
  constructor(
    private statementService: StatementService,
    private sessionService: SessionService,
  ) {
      // to get the username of the user who's session is currently active
      this.username=this.sessionService.getUser();
      this.statement={0:{'balance':'-','last_transaction':'-'}};
   }
  
   // to show the statement on init (load)
  ngOnInit() {
    this.showStatement(this.username);
  }

  // it fetches the returned data from the statementService and it checks if the response is proper or not
  showStatement(user:string){
    var temp=this.statementService.getStatement(user)
      .subscribe(resp=>{
        this.noUSER={
          balance:"wrong input",last_transaction:"user not found", 
         };
          this.statement={...resp.body};
          this.ifChecked=true;
          // if the status code is 200 then make the 404 bool as false
          if(resp.status==200){
            this.if404=false;
            this.ifChecked=true;
          }
          //if there's no user then return  the no user
          if(!resp){
            this.if404=true;
            this.ifChecked=false;
            this.statement={
              0:this.noUSER,
            };
          }
      });
      // console.log(temp);
      if(!temp.closed){
        this.if404=true;
        this.ifChecked=false;
      }
  }

}