import type {
    NextFunction,
    Request,
    Response,
} from "express";

import adminPaymentsService
    from "./admin-payments.service";
import {
    parseGetAdminPaymentsQuery,
} from "./admin-payments.validation";

class AdminPaymentsController {
    async getAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const query =
                parseGetAdminPaymentsQuery(
                    req.query as Record<
                        string,
                        unknown
                    >
                );

            const result =
                await adminPaymentsService
                    .getAll(query);

            res.status(200).json(
                result
            );
        } catch (error) {
            next(error);
        }
    }

    async getStats(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const stats =
                await adminPaymentsService
                    .getStats();

            res.status(200).json({
                stats,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AdminPaymentsController();
