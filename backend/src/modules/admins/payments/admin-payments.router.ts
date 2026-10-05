import {
    Router,
} from "express";

import {
    requirePermission,
} from "../middleware/require-permission.middleware";

import adminPaymentsController
    from "./admin-payments.controller";

const adminPaymentsRouter =
    Router();

adminPaymentsRouter.get(
    "/stats",
    requirePermission(
        "payments.read"
    ),
    adminPaymentsController
        .getStats
        .bind(
            adminPaymentsController
        )
);

adminPaymentsRouter.get(
    "/",
    requirePermission(
        "payments.read"
    ),
    adminPaymentsController
        .getAll
        .bind(
            adminPaymentsController
        )
);

export default adminPaymentsRouter;
