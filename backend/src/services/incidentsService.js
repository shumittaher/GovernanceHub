"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIncidents = listIncidents;
exports.createIncident = createIncident;
const incidentsDao_1 = require("../dao/incidentsDao");
async function listIncidents() {
    return (0, incidentsDao_1.fetchIncidents)();
}
async function createIncident(data) {
    return (0, incidentsDao_1.insertIncident)(data);
}
