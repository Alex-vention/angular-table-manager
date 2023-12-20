import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';

const routes: Routes = [
    {
        path: 'employees',
        component: EmployeesComponent,
        children: [
            {
                path: ':id',
                loadChildren: () =>
                    import('./employees/employee-details/employee-details.module').then(m => m.EmployeeDetailsModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
