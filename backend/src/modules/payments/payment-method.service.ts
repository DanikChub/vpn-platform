import PaymentMethod from "./payment-method.model";

class PaymentMethodService {
    async getActive(): Promise<PaymentMethod[]> {
        return PaymentMethod.findAll({
            where: {
                is_active: true,
            },
            order: [
                ["sort_order", "ASC"],
                ["id", "ASC"],
            ],
        });
    }

    async findByIds(
        ids: number[]
    ): Promise<PaymentMethod[]> {

        if (!ids.length) {
            return [];
        }

        return PaymentMethod.findAll({
            where: {
                id: ids,
            },
        });
    }
}

export default new PaymentMethodService();