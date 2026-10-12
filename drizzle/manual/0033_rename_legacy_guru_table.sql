-- Run once after backing up the database. This preserves every existing record.
BEGIN;

ALTER TABLE IF EXISTS guru_sispendik RENAME TO guru_sispendig;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'setoran_guru_guru_id_guru_sispendik_id_fk'
    ) THEN
        ALTER TABLE setoran_guru
            RENAME CONSTRAINT setoran_guru_guru_id_guru_sispendik_id_fk
            TO setoran_guru_guru_id_guru_sispendig_id_fk;
    END IF;
END $$;

COMMIT;
