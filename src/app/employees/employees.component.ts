import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../models/employee';
import { EmployeesService } from '../services/employees.service';
import { debounceTime } from 'rxjs';

@Component({
    selector: 'employees',
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css',
})
export class EmployeesComponent {
    employees: Employee[] = [];
    searchForm: FormGroup;
    newEmployeeForm: FormGroup;

    isActionsVisible: boolean = false;
    isEditMode: boolean = false;
    isAddNewMode: boolean = false;
    currentIndex: number | null = null;
    editingIndex: number = -1;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private employeesService: EmployeesService
    ) {
        this.searchForm = this.fb.group({
            search: [''],
        });

        this.newEmployeeForm = this.fb.group({
            name: ['', Validators.required],
            position: ['', Validators.required],
            salary: [0, [Validators.required, Validators.min(1)]],
        });
    }

    ngOnInit(): void {
        this.loadEmployees();

        this.searchForm.get('search')?.valueChanges.pipe(debounceTime(500))
            .subscribe((value) => {
                this.applyFilter(value);
            });
    }

    loadEmployees(): void {
        this.employeesService.getEmployees().subscribe((data) => {
            this.employees = data;
        });
    }

    goToDetails(employeeId?: number): void {
        this.router.navigate(['/details', employeeId]);
    }

    applyFilter(filterValue: string): void {
        this.loadEmployees();
        this.employees = this.employeesService.filterEmployees(
            this.employees,
            filterValue
        );
    }

    enableEditMode(index: number) {
        this.editingIndex = index;
        this.isEditMode = true;
    }

    disableEditMode() {
        this.editingIndex = -1;
        this.isEditMode = false;
    }

    showAddNewForm(): void {
      this.isAddNewMode = true;
    }

    hideAddNewForm(): void {
      this.isAddNewMode = false;
      this.newEmployeeForm.reset();
    }

    addEmployee(): void {
      this.newEmployeeForm.markAllAsTouched();
        if (this.newEmployeeForm.valid) {
            const newEmployee: Employee = this.newEmployeeForm.value as Employee;
            this.employeesService.addEmployee(newEmployee).subscribe(() => {
                this.loadEmployees();
                this.hideAddNewForm();
            });
        }
    }

    editEmployee(index: number): void {
        const editedEmployee = this.employees[index];
        this.employeesService
            .editEmployee(editedEmployee.id, editedEmployee)
            .subscribe(() => {
                this.loadEmployees();
                this.disableEditMode();
            });
    }

    deleteEmployee(index: number): void {
        const employeeToDelete = this.employees[index];

        if (employeeToDelete) {
            const confirmDelete = confirm(
                `Are you sure you want to delete ${employeeToDelete.name}?`
            );

            if (confirmDelete) {
                this.employeesService
                    .deleteEmployee(employeeToDelete.id)
                    .subscribe(() => {
                        this.loadEmployees();
                    });
            }
        }
    }

    showActions(rowIndex: number) {
        if (!this.isEditMode) {
            this.isActionsVisible = true;
            this.currentIndex = rowIndex;
        }
    }

    hideActions() {
        if (!this.isEditMode) {
            this.isActionsVisible = false;
            this.currentIndex = null;
        }
    }

    get newEmployeeName() {
        return this.newEmployeeForm.get('name');
    }

    get newEmployeePosition() {
        return this.newEmployeeForm.get('position');
    }

    get newEmployeeSalary() {
        return this.newEmployeeForm.get('salary');
    }
}
