'use server';

// Re-export dari setoran-guru-actions agar backward-compatible dan tetap terpusat di 1 file (KISS)
export { createGuru, updateGuru, deleteGuru } from './setoran-guru-actions';
