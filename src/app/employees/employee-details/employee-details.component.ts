import { Component } from '@angular/core';
import { Employee } from '../../models/employee';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';

@Component({
    selector: 'employee-details',
    templateUrl: './employee-details.component.html',
    styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent {
    employee: Employee | undefined;

    constructor(
        private route: ActivatedRoute,
        private employeesService: EmployeesService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const employeeId = params.get('id');

            if (employeeId) {
                this.employeesService.getEmployeeById(employeeId)
                    .subscribe((employee) => {
                        this.employee = employee;
                    });
            }
        });
    }
}
