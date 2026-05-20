"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const incidents_1 = __importDefault(require("./routes/incidents"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", async (_req, res) => {
    try {
        const result = await db_1.pool.query("SELECT NOW()");
        res.json({
            status: "ok",
            message: "GovernanceHub backend running",
            databaseTime: result.rows[0].now,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Database connection failed",
        });
    }
});
app.use("/api/incidents", incidents_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
