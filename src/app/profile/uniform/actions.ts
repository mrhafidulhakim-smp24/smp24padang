'use server';

import { db } from '@/lib/db';

export async function getUniforms() {
  return await db.query.uniforms.findMany();
}
