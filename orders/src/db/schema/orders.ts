import { integer, pgTable, pgEnum, text, timestamp } from "drizzle-orm/pg-core";
import { customers } from "./customers.ts";

export const orderStatus = pgEnum('order_status', {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELED: 'canceled',
})

export const orders = pgTable("orders", {
    id: text().primaryKey(),
    customerId: text().notNull().references(() => customers.id),
    amount: integer().notNull(),
    status: orderStatus().notNull().default('pending'),
    createdAt: timestamp().defaultNow().notNull(),
})