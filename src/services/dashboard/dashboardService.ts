import { getLocalDay } from "../../utils/projectAttention";
import { getProjectDirectory } from "../projects/projectService";
import { summarizeWorkspace } from "../../utils/summarizeWorkspace";

export async function getDashboard() {
  const directory = await getProjectDirectory();
  return summarizeWorkspace(directory, getLocalDay());
}

