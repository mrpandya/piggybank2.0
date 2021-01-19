import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BalanceComponent } from './balance/balance.component';
import { StatementComponent } from './statement/statement.component';
import { DepositComponent } from './deposit/deposit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { CreateNewComponent } from './create-new/create-new.component';
import { SigninComponent } from './signin/signin.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    BalanceComponent,
    StatementComponent,
    DepositComponent,
    WithdrawComponent,
    CreateNewComponent,
    SigninComponent,
    WelcomeComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
