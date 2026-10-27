CREATE TABLE "habit_checks" (
	"device_id" text,
	"habit" text,
	"day" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "habit_checks_pkey" PRIMARY KEY("device_id","habit","day")
);
