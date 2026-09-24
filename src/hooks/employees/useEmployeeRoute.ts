import { useParams } from "react-router-dom";

export function useEmployeeRoute() {
  const { id } = useParams();
  const employeeId = Number(id);
  const valid = !!id && /^[1-9]\d*$/.test(id) && Number.isSafeInteger(employeeId);
  return { employeeId, valid };
}
