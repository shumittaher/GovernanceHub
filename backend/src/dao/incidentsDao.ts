import { pool } from "../db";

export async function fetchIncidents() {
  const result = await pool.query(
    `SELECT * FROM incidents ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function insertIncident(data: {
  title: string;
  description?: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assigned_to?: string;
}) {
  const result = await pool.query(
    `INSERT INTO incidents
      (tenant_id, title, description, severity, status, assigned_to)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      1,
      data.title,
      data.description ?? null,
      data.severity,
      data.status,
      data.assigned_to ?? null,
    ]
  );

  return result.rows[0];
}
