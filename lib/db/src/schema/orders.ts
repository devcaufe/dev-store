import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  publicToken: text("public_token").notNull().unique(),
  clientName: text("client_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("pending"),
  pixPayload: text("pix_payload"),
  mpPaymentId: text("mp_payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  publicToken: true,
  status: true,
  pixPayload: true,
  mpPaymentId: true,
  createdAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
