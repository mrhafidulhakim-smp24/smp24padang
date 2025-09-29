import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    category: text('category').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
