import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import * as AuthController from "./server/controllers/AuthController";
import * as QuestionController from "./server/controllers/QuestionController";
import { authenticateToken } from "./server/middleware/auth";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// --- API Routes ---

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CPNS Master AI Backend Scalable Engine Ready" });
});

// Authentication
app.post("/api/auth/register", AuthController.register);
app.post("/api/auth/login", AuthController.login);

// Questions (Protected)
app.get("/api/questions", authenticateToken, QuestionController.getQuestions);
app.post("/api/questions", authenticateToken, QuestionController.createQuestion);

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`
    🚀 CPNS Master AI - Production Ready Engine
    -------------------------------------------
    - Environment: ${process.env.NODE_ENV || 'development'}
    - Port: ${PORT}
    - Architecture: Service-Repository (Clean)
    -------------------------------------------
    `);
  });
}

startServer();
