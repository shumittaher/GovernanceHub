"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIncidents = fetchIncidents;
exports.insertIncident = insertIncident;
const db_1 = require("../db");
async function fetchIncidents() {
    const result = await db_1.pool.query(`SELECT * FROM incidents ORDER BY created_at DESC`);
    return result.rows;
}
async function insertIncident(data) {
    const result = await db_1.pool.query(`INSERT INTO incidents
      (tenant_id, title, description, severity, status, assigned_to)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`, [
        1,
        data.title,
        data.description ?? null,
        data.severity,
        data.status,
        data.assigned_to ?? null,
    ]);
    return result.rows[0];
}
