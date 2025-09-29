// Curriculum Table
export const curriculums = pgTable('curriculums', {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    pdfUrl: text('pdf_url').notNull(),
    category: varchar('category', { length: 50 }).notNull(), // 'curriculum', 'student_affairs', 'facilities'
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export type Curriculum = typeof curriculums.$inferSelect;
export type InsertCurriculum = typeof curriculums.$inferInsert;