import { useParams } from "react-router-dom";

export function useProjectRoute() {
  const { id } = useParams();
  const projectId = Number(id);
  return { projectId, valid: !!id && /^[1-9]\d*$/.test(id) && Number.isSafeInteger(projectId) };
}
