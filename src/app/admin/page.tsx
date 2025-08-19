import { BackupReminderForm } from "@/components/admin/backup-reminder-form";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold text-primary md:text-5xl">
          Admin Dashboard
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Manage website content and utilities.
        </p>
      </div>

      <div className="mt-12 flex justify-center">
        <BackupReminderForm />
      </div>
    </div>
  );
}
