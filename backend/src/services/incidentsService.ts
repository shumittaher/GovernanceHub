import { fetchIncidents } from "../dao/incidentsDao";

export async function listIncidents() {
  return fetchIncidents();
}
