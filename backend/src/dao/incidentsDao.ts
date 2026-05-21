import { pool } from "../db";

export async function fetchIncidents(tenantId: number) {
  const result = await pool.query(
    `SELECT * FROM incidents WHERE tenant_id = $1 ORDER BY created_at DESC`,
    [tenantId]
  );
  return result.rows;
}

export async function fetchIncidentById(tenantId: number, incidentId: number) {
  const result = await pool.query(
    `SELECT * FROM incidents WHERE id = $1 AND tenant_id = $2`,
    [incidentId, tenantId]
  );

  return result.rows[0] ?? null;
}

export async function insertIncident(
  tenantId: number,
  data: {
    title: string;
    description?: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    assigned_to?: string;
  }
) {
  const result = await pool.query(
    `INSERT INTO incidents
      (tenant_id, title, description, severity, status, assigned_to)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      tenantId,
      data.title,
      data.description ?? null,
      data.severity,
      data.status,
      data.assigned_to ?? null,
    ]
  );

  return result.rows[0];
}

export async function updateIncident(
  tenantId: number,
  incidentId: number,
  updates: Partial<{
    title: string;
    description?: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    status: "Open" | "In Progress" | "Resolved" | "Closed";
    assigned_to?: string;
  }>
) {
  const allowedKeys = ["title", "description", "severity", "status", "assigned_to"];
  const setClauses: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      setClauses.push(`${key} = $${idx}`);
      // @ts-ignore
      values.push(updates[key as keyof typeof updates] ?? null);
      idx++;
    }
  }

  if (setClauses.length === 0) {
    return null;
  }

  // Add tenant and id params
  values.push(incidentId);
  values.push(tenantId);

  const query = `UPDATE incidents SET ${setClauses.join(", ")}
    WHERE id = $${idx} AND tenant_id = $${idx + 1}
    RETURNING *`;

  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
}
