import { defineDb, defineTable, column, NOW } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text(),
    emailVerified: column.boolean({ default: false }),
    image: column.text({ optional: true }),
    // Links an app user to their Stripe customer record.
    stripeCustomerId: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const enumValues = <T extends [string, ...string[]]>(...values: T) => values;

const STRIPE_EVENT_STATUSES = enumValues("received", "processed", "failed");

const CREDIT_LEDGER_ENTRY_TYPES = enumValues(
  "purchase_grant",
  "booking_deduct",
  "booking_refund",
  "manual_adjustment",
);

// Stores processed Stripe webhook events for idempotency and debugging.
const StripeEvent = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    stripeEventId: column.text(),
    eventType: column.text(),
    status: column.text({ enum: STRIPE_EVENT_STATUSES }),
    errorMessage: column.text({ optional: true }),
    processedAt: column.date({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

// Source of truth for student credit balance changes (+12, -1, refunds, etc.).
const CreditLedger = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    stripeEventId: column.text({ optional: true }),
    entryType: column.text({ enum: CREDIT_LEDGER_ENTRY_TYPES }),
    creditsDelta: column.number(),
    description: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    token: column.text(),
    expiresAt: column.date(),
    ipAddress: column.text({ optional: true }),
    userAgent: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Account = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    accountId: column.text(),
    providerId: column.text(),
    accessToken: column.text({ optional: true }),
    refreshToken: column.text({ optional: true }),
    accessTokenExpiresAt: column.date({ optional: true }),
    refreshTokenExpiresAt: column.date({ optional: true }),
    scope: column.text({ optional: true }),
    idToken: column.text({ optional: true }),
    password: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

const Verification = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    identifier: column.text(),
    value: column.text(),
    expiresAt: column.date(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: {
    User,
    Session,
    Account,
    Verification,
    StripeEvent,
    CreditLedger,
  },
});
