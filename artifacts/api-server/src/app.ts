import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { globalLimiter } from "./middlewares/rateLimit";

const app: Express = express();

// Trust the Replit reverse proxy so rate-limit / req.ip see the real client IP.
app.set("trust proxy", 1);

app.use(
  helmet({
    // We keep CSP off here because the static frontend is served by Vite
    // (dev) or as static files (prod) on a different artifact, with its own
    // policy. Helmet's other defaults (X-Content-Type-Options, X-DNS-Prefetch,
    // Referrer-Policy, etc.) are kept on.
    contentSecurityPolicy: false,
  }),
);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: Request & { id?: string | number | object }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: Response) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));

app.use(globalLimiter);
app.use("/api", router);

app.use(errorHandler);

export default app;
