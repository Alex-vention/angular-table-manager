import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Employee } from '../models/employee';
import { EmployeesService } from '../services/employees.service';
import { Subject, debounceTime, takeUntil } from 'rxjs';

const DEBOUNCE_TIME = 500;

@Component({
    selector: 'employees',
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit, OnDestroy {
    employees: Employee[] = [];

    isActionsVisible: boolean = false;
    isEditMode: boolean = false;
    isAddNewMode: boolean = false;
    currentIndex: number | null = null;
    editingIndex: number = -1;

    sortedColumn: string | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';

    private destroy$ = new Subject<void>();

    searchForm: FormGroup = this.fb.group({
        search: [''],
    });

    newEmployeeForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        position: ['', Validators.required],
        salary: [0, [Validators.required, Validators.min(1)]],
    });

    constructor(private router: Router, private fb: FormBuilder, private employeesService: EmployeesService) {}

    ngOnInit(): void {
        this.loadEmployees();

        this.searchForm
            .get('search')?.valueChanges.pipe(debounceTime(DEBOUNCE_TIME), takeUntil(this.destroy$))
            .subscribe(value => {
                this.applyFilter(value);
            });
    }

    loadEmployees(): void {
        this.employeesService
            .getEmployees()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
                this.employees = data;
            });
    }

    goToDetails(employeeId?: number): void {
        if (employeeId) {
            this.router.navigate(['/employees', employeeId]);
        }
    }

    applyFilter(filterValue: string): void {
        this.employeesService
            .getEmployees()
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
                this.employees = this.employeesService.filterEmployees(data, filterValue);
            });
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

    sortTable(column: keyof Employee): void {
        if (this.sortedColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortedColumn = column;
            this.sortDirection = 'asc';
        }

        this.employees.sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return this.sortDirection === 'asc' ? (aValue > bValue ? 1 : -1) : bValue > aValue ? 1 : -1;
            }

            return this.sortDirection === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue);
        });
    }

    addEmployee(): void {
        this.newEmployeeForm.markAllAsTouched();
        if (this.newEmployeeForm.valid) {
            const newEmployee: Employee = this.newEmployeeForm.value as Employee;
            this.employeesService
                .addEmployee(newEmployee)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                    this.loadEmployees();
                    this.hideAddNewForm();
                });
        }
    }

    editEmployee(index: number): void {
        const editedEmployee = this.employees[index];
        this.employeesService
            .editEmployee(editedEmployee.id, editedEmployee)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadEmployees();
                this.disableEditMode();
            });
    }

    deleteEmployee(index: number): void {
        const employeeToDelete = this.employees[index];

        if (employeeToDelete) {
            const confirmDelete = confirm(`Are you sure you want to delete ${employeeToDelete.name}?`);

            if (confirmDelete) {
                this.employeesService
                    .deleteEmployee(employeeToDelete.id)
                    .pipe(takeUntil(this.destroy$))
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

    isFormInvalid(control: any): boolean {
        return control?.invalid && (control?.dirty || control?.touched);
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
