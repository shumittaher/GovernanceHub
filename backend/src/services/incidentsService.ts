import {
  fetchIncidents,
  insertIncident,
} from "../dao/incidentsDao";

export async function listIncidents() {
  return fetchIncidents();
}

export async function createIncident(data: {
  title: string;
  description?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assigned_to?: string;
}) {
  return insertIncident(data);
}
