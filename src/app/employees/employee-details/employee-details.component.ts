import { Component, OnDestroy } from '@angular/core';
import { Employee } from '../../models/employee';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../services/employees.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'employee-details',
    templateUrl: './employee-details.component.html',
    styleUrl: './employee-details.component.css',
})
export class EmployeeDetailsComponent implements OnDestroy {
    employee: Employee | undefined;

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private employeesService: EmployeesService
    ) {}

    ngOnInit(): void {
        this.route.paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe((params) => {
                const employeeId = +params.get('id')!;

                if (!isNaN(employeeId)) {
                    this.fetchEmployeeDetails(employeeId);
                }
            });
    }

    private fetchEmployeeDetails(employeeId: number): void {
        this.employeesService.getEmployeeById(employeeId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (employee) => {
                  this.employee = employee;
                },
                error: (error) => {
                  console.error('Error fetching employee details:', error);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
