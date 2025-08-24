
"use server";

import prisma from "@/lib/prisma";

export async function getAcademics() {
  let academicData = await prisma.academic.findFirst();

  if (!academicData) {
    // This is a fallback, but the admin page should create a default one.
    return null;
  }
  return academicData;
}
