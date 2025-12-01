import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes/index";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// ---------------------
// CORS CONFIG
// ---------------------
const allowedOrigins: string[] = [
  "https://canada.easyvisa.ai"
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Always allow local dev
allowedOrigins.push("http://localhost:5173");


app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Register routes
const server = registerRoutes(app);

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Start server
const port = parseInt(process.env.PORT || "5000", 10);

server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
