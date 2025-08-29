-- Create a sequence for the id column
CREATE SEQUENCE uniforms_id_seq;

-- Set the default value of the id column to use the sequence
ALTER TABLE "uniforms" ALTER COLUMN "id" SET DEFAULT nextval('uniforms_id_seq');

-- Set the sequence to be owned by the id column (optional but good practice)
ALTER SEQUENCE uniforms_id_seq OWNED BY "uniforms"."id";