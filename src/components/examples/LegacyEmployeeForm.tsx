import type { UserPreview } from "../../types/user.types";
import { useState, type ChangeEvent, type FormEvent } from "react";




export function EmployeeForm() {
  // This are the states for the form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  // const [employees, setEmployees] = useState<Employee[]>([]);
  // const [employee, setEmployee] = useState<Employee | null>(null);
  const [user, setUser] = useState<UserPreview | null>(null);
  const [activeStatus, setActiveStatus] = useState(true);
  const [loading, setLoading] = useState(false);


  function handleUserLogin() {
    setLoading(true);
    if (user) {
      setUser(user)
    }
    else {
      return <h1>Not logged in</h1>;
    }
  }

  // if (user !== null) {
  //   return <h1>Logged in {user.name}</h1>;
  // } else {
  //   return <h1>Not logged in</h1>;
  //   }
  //This handles the change event for the email input fields
  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  //This handles the change event for the department select field
  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  // This handles the change event for the password input field
  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  // This handles the change event for the department select field
  function handleDepartmentChange(e: ChangeEvent<HTMLSelectElement>) {
    setDepartment(e.target.value);
  }

  //This handles the change event for the active status checkbox
  function handleActiveChange(e: ChangeEvent<HTMLInputElement>) {
    setActiveStatus(e.target.checked);
  }

  // This handles the form submission event
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // localStorage.setItem("email", email);
    // localStorage.setItem("password", password);
    // localStorage.setItem("department", department);
    // localStorage.setItem("activeStatus", activeStatus.toString());
    console.log("Submitted");
    setLoading(false);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={handleNameChange} />

        <input type="email" value={email} onChange={handleEmailChange} />

        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />

        {/* <input type="text" value={department} onChange={handleDepartmentChange} /> */}
        <select value={department} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={activeStatus}
            onChange={handleActiveChange}
          />
          Active
        </label>

        <button type="submit" disabled={loading} onClick={handleUserLogin}>
          Login
        </button>
        <p>{loading ? "Loading..." : ""}</p>
      </form>
    </>
  );
}

