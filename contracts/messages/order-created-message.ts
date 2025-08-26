export interface OrderCreatedMessage {
    //   type: 'order-created';
    orderId: string;
    amount: number;
    customer: {
        id: string;
    },
}