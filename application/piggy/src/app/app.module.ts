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

@NgModule({
  declarations: [
    AppComponent,
    BalanceComponent,
    StatementComponent,
    DepositComponent,
    WithdrawComponent,
    CreateNewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
