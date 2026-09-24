import type { IEmployee } from "../interfaces/I-Employee";
import type { IApiResponse } from "../interfaces/I-ApiResponse";


export async function getEmployees(): Promise<IApiResponse<IEmployee[]>> {
    // const response = await fetch("http://localhost:3000/employees");
    // if(!response.ok) {
    // Throw new Error(`Failed to fetch employees: ${response.statusText}`);
    // }
    // const employees = await response.json();
    // return employees;
    const employees: IEmployee[] = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            department: "Finance",
            active: true
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            department: "IT",
            active: true
        }
    ];
    return { success: true, data: employees };
}

export async function getEmployee(id: number): Promise<IApiResponse<IEmployee>> {
    const response = await fetch(`http://localhost:3000/employees/${id}`);
    if(!response.ok) {
        throw new Error(`Failed to fetch employee with id ${id}: ${response.statusText}`);
    }
    const employee : IApiResponse<IEmployee> = await response.json();
    return employee;
}

export async function createEmployee(employee: IEmployee): Promise<IApiResponse<IEmployee>> {
    const response = await fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employee)
    });
    const data = await response.json();
    return data;
}


