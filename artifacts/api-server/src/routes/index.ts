import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ordersRouter from "./orders";
import paymentsRouter from "./payments";
import webhooksRouter from "./webhooks";
import quoteRouter from "./quote";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ordersRouter);
router.use(paymentsRouter);
router.use(webhooksRouter);
router.use(quoteRouter);

export default router;
