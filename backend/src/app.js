import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

/**
 * Security Middlewares
 */
app.use(helmet());

/**
 * Performance Middlewares
 */
app.use(compression());

/**
 * CORS
 */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Body Parsers
 */
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1", routes);

// Error Handling Middleware
app.use(errorHandler);
export default app;