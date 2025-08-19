"use server";

import { z } from "zod";
import {
  generateDatabaseBackupReminder,
  type GenerateDatabaseBackupReminderInput,
} from "@/ai/flows/generate-database-backup-reminder";

const formSchema = z.object({
  lastBackupDate: z.string(),
  backupIntervalDays: z.coerce.number(),
});

export async function generateReminderAction(input: GenerateDatabaseBackupReminderInput) {
  try {
    const validatedInput = formSchema.parse(input);
    const result = await generateDatabaseBackupReminder(validatedInput);
    return { reminder: result.reminder };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error };
  }
}
