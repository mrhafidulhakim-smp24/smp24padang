"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateReminderAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  lastBackupDate: z.string().min(1, "Last backup date is required."),
  backupIntervalDays: z.coerce.number().min(1, "Backup interval must be at least 1 day."),
});

type FormValues = z.infer<typeof formSchema>;

export function BackupReminderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [reminder, setReminder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastBackupDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      backupIntervalDays: 14,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReminder(null);
    setError(null);
    const result = await generateReminderAction(values);
    if (result.reminder) {
      setReminder(result.reminder);
    } else if (result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="text-accent" />
          Generate Backup Reminder
        </CardTitle>
        <CardDescription>
          This AI-powered tool helps you decide when to remind staff to perform a database backup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="lastBackupDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Backup Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backupIntervalDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backup Interval (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Reminder"
              )}
            </Button>
          </form>
        </Form>

        {reminder && (
          <Alert className="mt-6 border-primary/50 text-primary">
            <Sparkles className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-headline">Generated Reminder</AlertTitle>
            <AlertDescription>{reminder}</AlertDescription>
          </Alert>
        )}

        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
