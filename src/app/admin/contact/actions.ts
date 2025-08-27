
"use server";

import { db } from "@/lib/db";
import { contact } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from 'uuid';

export async function getContactInfo() {
  try {
    const result = await db.select().from(contact).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return null;
  }
}

export async function updateContactInfo(data: { address: string; phone: string; email: string; }) {
  try {
    const existingContact = await db.select().from(contact).limit(1);

    if (existingContact.length > 0) {
      await db
        .update(contact)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(contact.id, existingContact[0].id));
    } else {
      await db.insert(contact).values({
        id: uuidv4(),
        ...data,
      });
    }

    revalidatePath("/admin/contact");
    revalidatePath("/contact");
    revalidatePath("/"); 

    return { success: true, message: "Informasi kontak berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, message: "Gagal memperbarui informasi kontak." };
  }
}
