'use server';

import { db } from '@/lib/db';

export async function getUniforms() {
  const allUniforms = await db.query.uniforms.findMany();
  return allUniforms;
}
