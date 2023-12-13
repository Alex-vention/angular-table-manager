import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent, EmployeesComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule, ReactiveFormsModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
