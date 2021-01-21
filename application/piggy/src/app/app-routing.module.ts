import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { CreateNewComponent } from './create-new/create-new.component';
import { BalanceComponent } from './balance/balance.component';
import { StatementComponent } from './statement/statement.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { DepositComponent } from './deposit/deposit.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path:'', component: WelcomeComponent },
  { path:'signin', component:SigninComponent },
  { path:'signup', component:CreateNewComponent },
  { path:'balance', component:BalanceComponent },
  { path:'statement', component:StatementComponent },
  { path:'withdraw', component:WithdrawComponent },
  { path:'deposit', component:DepositComponent },
  { path:'logout', component:LogoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
