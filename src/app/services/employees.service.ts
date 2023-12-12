import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable({
    providedIn: 'root',
})
export class EmployeesService {
    private apiUrl = 'https://6578672bf08799dc80453209.mockapi.io/';

    constructor(private http: HttpClient) {}

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl + 'employees');
    }

    addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl + 'employees', employee);
    }

    filterEmployees(employees: Employee[], filter: string): Employee[] {
        if (!filter) {
            return employees;
        }

        return employees.filter((employee) => {
            return employee.name.toLowerCase().includes(filter.toLowerCase());
        });
    }
}
