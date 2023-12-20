import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeesComponent } from './employees/employees.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeDetailsModule } from './employees/employee-details/employee-details.module';
import { StopPropagationDirective } from './directivies/stop-propagation.directive';

@NgModule({
    declarations: [AppComponent, EmployeesComponent, StopPropagationDirective],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule, ReactiveFormsModule, FormsModule, EmployeeDetailsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
