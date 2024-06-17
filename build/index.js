"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appRouter = require('./src/Routes/appRouter');
const cors = require('cors');
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = 4000;
app.use(cors());
app.use(express_1.default.json());
app.use('/practice-backend/manager', appRouter);
app.listen(PORT, () => {
    console.log(`Server is Fire at ${PORT} port`);
});
