CREATE TABLE "past_principals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"period" text NOT NULL,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
