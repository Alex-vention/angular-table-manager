import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../models/employee';
import { EmployeesService } from '../services/employees.service';
import { Observable, debounceTime, map } from 'rxjs';

@Component({
    selector: 'employees',
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css',
})
export class EmployeesComponent {
    employees: Observable<Employee[]> | undefined;
    searchForm: FormGroup;
    employeeForm: FormGroup;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private employeesService: EmployeesService
    ) {
        this.searchForm = this.fb.group({
            search: [''],
        });

        this.employeeForm = this.fb.group({
            name: ['', Validators.required],
            position: ['', Validators.required],
            salary: [0, [Validators.required, Validators.min(0)]],
        });
    }

    ngOnInit(): void {
      this.employees = this.employeesService.getEmployees();

        this.searchForm.get('search')?.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
          this.applyFilter(value);
        });
    }

    goToDetails(employeeId?: number): void {
        this.router.navigate(['/details', employeeId]);
    }

    applyFilter(filterValue: string): void {
      this.employees = this.employeesService.getEmployees().pipe(
        map((employees) => this.employeesService.filterEmployees(employees, filterValue))
      );
    }

    get employeeName() {
        return this.employeeForm.get('name');
    }

    get employeePosition() {
        return this.employeeForm.get('position');
    }

    get employeeSalary() {
        return this.employeeForm.get('salary');
    }

    addEmployee(): void {
        if (this.employeeForm.valid) {
            const newEmployee: Employee = this.employeeForm.value as Employee;
            this.employeesService.addEmployee(newEmployee).subscribe(() => {
                this.employees = this.employeesService.getEmployees();
                this.employeeForm.reset();
            });
        }
    }
}
