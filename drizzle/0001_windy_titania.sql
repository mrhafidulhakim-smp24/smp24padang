CREATE TABLE "marquee" (
	"id" varchar PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"text" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
