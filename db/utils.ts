import { defineTable, column } from "astro:db";
import { produce } from "immer";

/**
 * Extended defineTable that automatically adds createdAt and updatedAt fields
 * @param config - Table configuration object
 * @returns Table definition with timestamp fields
 */
export function defineTableWithTimestamps(
  config: Parameters<typeof defineTable>[0]
) {
  return defineTable({
    ...config,
    columns: {
      ...config.columns,
      createdAt: column.date({ default: new Date() }),
      updatedAt: column.date({ default: new Date() }),
    },
  });
}
