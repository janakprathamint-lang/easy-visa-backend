CREATE TABLE "contact_messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"submitted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "submissions" RENAME COLUMN "otp_code" TO "education_grade";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "education" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "grade_type" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "has_language_test" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "language_test" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "ielts_score" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "course_relevance" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "course_type" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "institution_type" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "gap_years" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "proof_of_funds" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "strong_sop" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "public_university_loa" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "has_work_experience" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "work_experience_years" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "financial_capacity" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "preferred_intake" text;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "preferred_province" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" DROP COLUMN "otp_verified";