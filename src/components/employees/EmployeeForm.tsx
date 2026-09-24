import { UnsavedChangesDialog } from "../common/UnsavedChangesDialog";
import type { EmployeeFormProps } from "../../interfaces/employee.interfaces";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight, FiUserPlus } from "react-icons/fi";
import { useEmployeeForm } from "../../hooks/employees/useEmployeeForm";
import { departments } from "../../validation/employee.validation";
import styles from "../../styles/employees/EmployeeForm.module.css";
import { Notification } from "../common/Notification";

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const form = useEmployeeForm(employee);
  return <div className={styles.page}>
    {form.navigation.blocker.state === "blocked" && <UnsavedChangesDialog onStay={form.navigation.blocker.reset} onDiscard={form.navigation.blocker.proceed} submitting={form.submitting} />}
    <Link className={styles.back} to="/employees"><FiArrowLeft /> Back to people</Link>
    <p className={styles.eyebrow}>{employee ? "PEOPLE / EDIT EMPLOYEE" : "PEOPLE / NEW EMPLOYEE"}</p>
    <h1>{employee ? "Keep your people in focus" : "Make room for someone great"}<span>.</span></h1>
    <p className={styles.subtitle}>{employee ? "Update employee details and keep your directory current." : "Every great team starts with its people. Add your next collaborator."}</p>
    <div className={styles.layout}>
      <form className={styles.form} onSubmit={form.submit} noValidate aria-busy={form.submitting}>
        <div className={styles.formHeader}><span className={styles.icon}><FiUserPlus /></span><div><h2>Personal details</h2><p>Name, email, and department are required.</p></div></div>
        {form.error && <Notification tone="error" message={form.error} onClose={form.dismissError} />}
        <fieldset disabled={form.submitting}>
          <legend className="sr-only">Employee details</legend>
          <label htmlFor="employee-name">Full name</label>
          <input id="employee-name" name="name" autoComplete="name" required value={form.values.name} onChange={(event) => form.change("name", event.target.value)} onBlur={() => form.touch("name")} aria-invalid={!!form.errors.name} aria-describedby={form.errors.name ? "name-error" : undefined} placeholder="e.g. Amara Okafor" />
          {form.errors.name && <p id="name-error" className={styles.fieldError}>{form.errors.name}</p>}
          <label htmlFor="employee-email">Email address</label>
          <input id="employee-email" name="email" type="email" autoComplete="email" required value={form.values.email} onChange={(event) => form.change("email", event.target.value)} onBlur={() => form.touch("email")} aria-invalid={!!form.errors.email} aria-describedby={form.errors.email ? "email-error" : undefined} placeholder="name@company.com" />
          {form.errors.email && <p id="email-error" className={styles.fieldError}>{form.errors.email}</p>}
          <label htmlFor="employee-department">Department</label>
          <select id="employee-department" name="department" required value={form.values.department} onChange={(event) => form.change("department", event.target.value)} onBlur={() => form.touch("department")} aria-invalid={!!form.errors.department} aria-describedby={form.errors.department ? "department-error" : undefined}><option value="">Choose a department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select>
          {form.errors.department && <p id="department-error" className={styles.fieldError}>{form.errors.department}</p>}
          <label className={styles.status}><input name="active" type="checkbox" checked={form.values.active} onChange={(event) => form.change("active", event.target.checked)} /><span>Active employee<small>Include this person in your active team.</small></span></label>
        </fieldset>
        <p className={styles.draftStatus} role="status">{form.submitting ? "Saving your changes…" : form.dirty ? "Unsaved changes · save before leaving" : "No unsaved changes"}</p>
        <div className={styles.actions}><button type="button" disabled={form.submitting} onClick={form.cancel}>Cancel</button><button type="submit" disabled={form.submitting}>{form.submitting ? "Saving employee…" : employee ? "Save changes" : "Add employee"}<FiArrowUpRight /></button></div>
        <span className="sr-only" role="status">{form.submitting ? "Saving employee. Please wait." : ""}</span>
      </form>
      <aside className={styles.note}><span className={styles.eyebrow}>A PLACE TO BELONG</span><h2>{employee ? <>A clearer picture.<br />A connected team.</> : <>New perspective.<br />New possibilities.</>}</h2><p>Bring the right people into view. Their profile will be ready in your directory as soon as you save.</p><div><strong>Your demo workspace</strong><p>Records are saved in this browser. Adding an employee does not send an invitation or create a login.</p></div></aside>
    </div>
  </div>;
}



