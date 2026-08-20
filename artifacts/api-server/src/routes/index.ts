import { Router, type IRouter } from "express";
import healthRouter from "./health";
import operationsRouter from "./operations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(operationsRouter);

export default router;
