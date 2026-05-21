import {
  fetchIncidents,
  insertIncident,
} from "../dao/incidentsDao";

export async function listIncidents(tenantId: number) {
  return fetchIncidents(tenantId);
}

export async function createIncident(
  tenantId: number,
  data: {
    title: string;
    description?: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    assigned_to?: string;
  }
) {
  return insertIncident(tenantId, data);
}
