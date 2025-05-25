"use strict";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const _filename = fileURLToPath(import.meta.url);

const _dirname = path.dirname(_filename);

const envFilePath = path.resolve(_dirname, ".env");

dotenv.config({ path: envFilePath });

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || "localhost";
export const DB_USERNAME = process.env.DB_USERNAME || "root";
export const PASSWORD = process.env.PASSWORD || "password";
export const DATABASE = process.env.DATABASE || "mydatabase";
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const cookieKey = process.env.cookieKey;