import { integer, pgTable, pgEnum, text, timestamp } from "drizzle-orm/pg-core";

export const orderStatus = pgEnum('order_status', {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELED: 'canceled',
})

export const orders = pgTable("orders", {
    id: text().primaryKey(),
    customerId: text().notNull(),
    amount: integer().notNull(),
    status: orderStatus().notNull().default('pending'),
    createdAt: timestamp().defaultNow().notNull(),
})