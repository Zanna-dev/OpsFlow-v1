import type { EmployeePreview } from "../../types/projectCard.types";
import type { ProjectCardProps } from "../../interfaces/ProjectCard.interfaces";
import { useState, type ChangeEvent, type FormEvent } from "react";

export function ProjectCard({
  id,
  name,
  description,
  progress,
  status,
  onView,
}: ProjectCardProps) {
  return (
    <>
      <h1>{name}</h1>
      <p>{description}</p>
      <p>{progress}</p>
      <p>{status}</p>
      <button onClick={() => onView(id)}>View</button>
    </>
  );
}

export function Buttons() {
  const [email, setEmail] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Submitted");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={handleChange} />
      </form>
    </>
  );
}



  
export function EmployeeForm() {
  

  const [selectedEmployee] = useState<EmployeePreview | null>(
    null,
  );

  if (!selectedEmployee) {
    return <h2>No employee selected</h2>;
  }

  return (
    <>
      <h1>{selectedEmployee.name}</h1>
      <p>{selectedEmployee.email}</p>
    </>
  );
}

