import { useLocation, useNavigate } from "react-router-dom";

export function useRouteNotification() {
  const location = useLocation();
  const navigate = useNavigate();
  const name = typeof location.state?.createdEmployeeName === "string" ? location.state.createdEmployeeName : null;
  const updatedName = typeof location.state?.updatedEmployeeName === "string" ? location.state.updatedEmployeeName : null;
  const projectName = typeof location.state?.createdProjectName === "string" ? location.state.createdProjectName : null;
  const updatedProjectName = typeof location.state?.updatedProjectName === "string" ? location.state.updatedProjectName : null;
  function dismiss() {
    const nextState = { ...location.state };
    delete nextState.createdEmployeeName;
    delete nextState.updatedEmployeeName;
    delete nextState.createdProjectName;
    delete nextState.updatedProjectName;
    navigate(`${location.pathname}${location.search}${location.hash}`, { replace: true, state: nextState });
  }
  return { message: updatedProjectName ? `${updatedProjectName} was updated successfully.` : projectName ? `${projectName} was created successfully.` : updatedName ? `${updatedName} was updated successfully.` : name ? `${name} was added successfully to this demo workspace.` : null, dismiss };
}
