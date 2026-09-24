export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  active: boolean;
}

export interface EmployeeFormProps { employee?: Employee; }

export interface EmployeeRecordProps { id: number; }

export interface EmployeeDeletionOptions { onDeleted: (id: number) => void; }
