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

    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}employees/${id}`);
    }

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(`${this.apiUrl}employees`);
    }

    addEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}employees`, employee);
    }

    editEmployee(id: number, updatedEmployee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}employees/${id}`, updatedEmployee);
    }

    deleteEmployee(id: number): Observable<Employee> {
        return this.http.delete<Employee>(`${this.apiUrl}employees/${id}`);
    }

    filterEmployees(employees: Employee[], filter: string): Employee[] {
        if (!filter) {
          return employees;
        }
      
        const lowercaseFilter = filter.toLowerCase();
      
        return employees.filter((employee) => {
          const matchesName = employee.name.toLowerCase().includes(lowercaseFilter);
          const matchesPosition = employee.position.toLowerCase().includes(lowercaseFilter);
          const matchesSalary = employee.salary.toString().includes(filter);
      
          return matchesName || matchesPosition || matchesSalary;
        });
      }
}
