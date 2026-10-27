import { pgTable, text, date, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const habitChecks = pgTable(
  "habit_checks",
  {
    deviceId: text("device_id").notNull(),
    habit: text("habit").notNull(),
    day: date("day").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.deviceId, t.habit, t.day] })]
);
