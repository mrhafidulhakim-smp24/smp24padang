CREATE TABLE "uniforms" (
	"id" integer PRIMARY KEY NOT NULL,
	"day" text NOT NULL,
	"description" text NOT NULL,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
