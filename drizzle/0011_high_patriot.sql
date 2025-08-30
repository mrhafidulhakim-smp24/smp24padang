CREATE TABLE "organization_structures" (
	"type" varchar(50) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"imageUrl" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
