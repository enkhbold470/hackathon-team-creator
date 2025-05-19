-- CreateTable
CREATE TABLE "applications" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "cwid" TEXT,
    "full_name" TEXT,
    "discord" TEXT,
    "skill_level" TEXT,
    "hackathon_experience" TEXT,
    "hear_about_us" TEXT,
    "why_attend" TEXT,
    "project_experience" TEXT,
    "future_plans" TEXT,
    "fun_fact" TEXT,
    "self_description" TEXT,
    "links" TEXT,
    "teammates" TEXT,
    "referral_email" TEXT,
    "dietary_restrictions_extra" TEXT,
    "tshirt_size" TEXT,
    "agree_to_terms" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "user_id_1" TEXT NOT NULL,
    "user_id_2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_user_id_key" ON "applications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "matches_user_id_1_user_id_2_key" ON "matches"("user_id_1", "user_id_2");

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "applications"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "applications"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
