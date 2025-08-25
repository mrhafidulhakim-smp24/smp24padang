
"use server";

import prisma from "@/lib/prisma";

export async function getGalleryItems() {
    return await prisma.galleryItem.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
}
