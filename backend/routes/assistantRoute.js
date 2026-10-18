import express from "express";
import { askAssistant } from "../controllers/assistantController.js";
import assistantRateLimit from "../middleware/assistantRateLimit.js";
import optionalCustomerAuth from "../middleware/optionalCustomerAuth.js";

const assistantRouter = express.Router();

assistantRouter.post(
    "/chat",
    optionalCustomerAuth,
    assistantRateLimit,
    askAssistant
);

export default assistantRouter;
