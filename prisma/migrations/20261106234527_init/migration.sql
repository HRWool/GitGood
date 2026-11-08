-- CreateEnum
CREATE TYPE "QuestLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'TIMED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('IN_PROGRESS', 'PASSED', 'ABANDONED', 'TIMED_OUT');

-- CreateEnum
CREATE TYPE "XpReason" AS ENUM ('QUEST_COMPLETION', 'BONUS', 'ADMIN_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "SeasonStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'WITHDRAWN', 'COMPLETED');

-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('SKILLS', 'STREAKS', 'SEASONS', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "BadgeRuleType" AS ENUM ('FIRST_QUEST', 'STREAK_DAYS', 'SKILL_QUEST_COUNT', 'TIMED_QUESTS', 'CLASS_COMPLETION', 'SEASON_TOP_RANK', 'FRIEND_COUNT', 'HINTLESS_COMPLETIONS', 'TIME_OF_DAY');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('STREAK', 'QUEST', 'LEADERBOARD');

-- CreateEnum
CREATE TYPE "InventoryItem" AS ENUM ('STREAK_FREEZE');

-- CreateEnum
CREATE TYPE "LeaderboardScope" AS ENUM ('GLOBAL', 'CLASSROOM', 'FRIENDS');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "username" VARCHAR(18) NOT NULL,
    "displayName" VARCHAR(80),
    "avatar" VARCHAR(16) NOT NULL DEFAULT '🦊',
    "timezone" VARCHAR(64) NOT NULL DEFAULT 'America/New_York',
    "preferredReminderTime" TIME(0),
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "normalizedName" VARCHAR(60) NOT NULL,
    "icon" VARCHAR(16) NOT NULL DEFAULT '✨',
    "ownerStudentId" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentSkill" (
    "studentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentSkill_pkey" PRIMARY KEY ("studentId","skillId")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "QuestLevel" NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL,
    "timeLimitSeconds" INTEGER,
    "prompt" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "speakerName" VARCHAR(100) NOT NULL,
    "speakerAvatar" VARCHAR(16) NOT NULL,
    "speakerRole" VARCHAR(100) NOT NULL,
    "hint" TEXT NOT NULL,
    "codeTemplate" TEXT[],
    "badgeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestConcept" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "QuestConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestBlank" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "QuestBlank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestAnswer" (
    "id" TEXT NOT NULL,
    "blankId" TEXT NOT NULL,
    "value" VARCHAR(200) NOT NULL,
    "normalizedValue" VARCHAR(200) NOT NULL,

    CONSTRAINT "QuestAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestTest" (
    "id" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "description" VARCHAR(200) NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "QuestTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQuestAssignment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "activityDate" DATE NOT NULL,
    "position" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyQuestAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "status" "AttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "hintUsed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "QuestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestAttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "blankId" TEXT NOT NULL,
    "value" VARCHAR(200) NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestAttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XpTransaction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "XpReason" NOT NULL,
    "questAttemptId" TEXT,
    "classEnrollmentId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" "SeasonStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "description" TEXT,
    "icon" VARCHAR(16) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassroomOffering" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassroomOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassWeek" (
    "id" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "topic" VARCHAR(120) NOT NULL,
    "instructorMessage" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassQuest" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "dueAt" TIMESTAMP(3),

    CONSTRAINT "ClassQuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassEnrollment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "offeringId" TEXT NOT NULL,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassQuestCompletion" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "classQuestId" TEXT NOT NULL,
    "questAttemptId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassQuestCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "icon" VARCHAR(16) NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "slug" VARCHAR(40) NOT NULL,
    "description" TEXT NOT NULL,
    "ruleType" "BadgeRuleType" NOT NULL,
    "ruleTarget" INTEGER,
    "ruleConfig" JSONB,
    "skillId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBadge" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialId" VARCHAR(32) NOT NULL,

    CONSTRAINT "StudentBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PinnedBadge" (
    "studentId" TEXT NOT NULL,
    "studentBadgeId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "PinnedBadge_pkey" PRIMARY KEY ("studentId","position")
);

-- CreateTable
CREATE TABLE "FriendRelationship" (
    "id" TEXT NOT NULL,
    "lowStudentId" TEXT NOT NULL,
    "highStudentId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "FriendRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "studentId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("studentId","type")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "item" "InventoryItem" NOT NULL,
    "delta" INTEGER NOT NULL,
    "reason" VARCHAR(120) NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathLesson" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "position" INTEGER NOT NULL,
    "questId" TEXT,

    CONSTRAINT "PathLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentLessonProgress" (
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "StudentLessonProgress_pkey" PRIMARY KEY ("studentId","lessonId")
);

-- CreateTable
CREATE TABLE "LeaderboardPeriod" (
    "id" TEXT NOT NULL,
    "scope" "LeaderboardScope" NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "offeringId" TEXT,
    "ownerStudentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaderboardPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaderboardEntry" (
    "id" TEXT NOT NULL,
    "periodId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "LeaderboardEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");

-- CreateIndex
CREATE INDEX "Student_createdAt_idx" ON "Student"("createdAt");

-- CreateIndex
CREATE INDEX "Skill_name_idx" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_ownerStudentId_normalizedName_key" ON "Skill"("ownerStudentId", "normalizedName");

-- CreateIndex
CREATE INDEX "StudentSkill_skillId_idx" ON "StudentSkill"("skillId");

-- CreateIndex
CREATE INDEX "Quest_skillId_level_idx" ON "Quest"("skillId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "QuestConcept_questId_position_key" ON "QuestConcept"("questId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "QuestConcept_questId_name_key" ON "QuestConcept"("questId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "QuestBlank_questId_position_key" ON "QuestBlank"("questId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "QuestAnswer_blankId_normalizedValue_key" ON "QuestAnswer"("blankId", "normalizedValue");

-- CreateIndex
CREATE UNIQUE INDEX "QuestTest_questId_position_key" ON "QuestTest"("questId", "position");

-- CreateIndex
CREATE INDEX "DailyQuestAssignment_activityDate_studentId_idx" ON "DailyQuestAssignment"("activityDate", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuestAssignment_studentId_activityDate_position_key" ON "DailyQuestAssignment"("studentId", "activityDate", "position");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuestAssignment_studentId_activityDate_questId_key" ON "DailyQuestAssignment"("studentId", "activityDate", "questId");

-- CreateIndex
CREATE INDEX "QuestAttempt_studentId_startedAt_idx" ON "QuestAttempt"("studentId", "startedAt");

-- CreateIndex
CREATE INDEX "QuestAttempt_questId_status_idx" ON "QuestAttempt"("questId", "status");

-- CreateIndex
CREATE INDEX "QuestAttemptAnswer_attemptId_idx" ON "QuestAttemptAnswer"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "XpTransaction_questAttemptId_key" ON "XpTransaction"("questAttemptId");

-- CreateIndex
CREATE INDEX "XpTransaction_studentId_occurredAt_idx" ON "XpTransaction"("studentId", "occurredAt");

-- CreateIndex
CREATE INDEX "XpTransaction_classEnrollmentId_occurredAt_idx" ON "XpTransaction"("classEnrollmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "Season_status_startsAt_endsAt_idx" ON "Season"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Classroom_skillId_level_idx" ON "Classroom"("skillId", "level");

-- CreateIndex
CREATE INDEX "ClassroomOffering_seasonId_idx" ON "ClassroomOffering"("seasonId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomOffering_classroomId_seasonId_key" ON "ClassroomOffering"("classroomId", "seasonId");

-- CreateIndex
CREATE INDEX "ClassWeek_startsAt_endsAt_idx" ON "ClassWeek"("startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClassWeek_offeringId_weekNumber_key" ON "ClassWeek"("offeringId", "weekNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClassQuest_weekId_position_key" ON "ClassQuest"("weekId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ClassQuest_weekId_questId_key" ON "ClassQuest"("weekId", "questId");

-- CreateIndex
CREATE INDEX "ClassEnrollment_offeringId_status_idx" ON "ClassEnrollment"("offeringId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClassEnrollment_studentId_offeringId_key" ON "ClassEnrollment"("studentId", "offeringId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassQuestCompletion_questAttemptId_key" ON "ClassQuestCompletion"("questAttemptId");

-- CreateIndex
CREATE INDEX "ClassQuestCompletion_classQuestId_completedAt_idx" ON "ClassQuestCompletion"("classQuestId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClassQuestCompletion_enrollmentId_classQuestId_key" ON "ClassQuestCompletion"("enrollmentId", "classQuestId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

-- CreateIndex
CREATE INDEX "Badge_category_idx" ON "Badge"("category");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBadge_credentialId_key" ON "StudentBadge"("credentialId");

-- CreateIndex
CREATE INDEX "StudentBadge_studentId_earnedAt_idx" ON "StudentBadge"("studentId", "earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudentBadge_studentId_badgeId_key" ON "StudentBadge"("studentId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "PinnedBadge_studentBadgeId_key" ON "PinnedBadge"("studentBadgeId");

-- CreateIndex
CREATE UNIQUE INDEX "PinnedBadge_studentId_studentBadgeId_key" ON "PinnedBadge"("studentId", "studentBadgeId");

-- CreateIndex
CREATE INDEX "FriendRelationship_requestedById_status_idx" ON "FriendRelationship"("requestedById", "status");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRelationship_lowStudentId_highStudentId_key" ON "FriendRelationship"("lowStudentId", "highStudentId");

-- CreateIndex
CREATE INDEX "InventoryTransaction_studentId_item_occurredAt_idx" ON "InventoryTransaction"("studentId", "item", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_skillId_name_key" ON "LearningPath"("skillId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PathLesson_learningPathId_position_key" ON "PathLesson"("learningPathId", "position");

-- CreateIndex
CREATE INDEX "LeaderboardPeriod_scope_startsAt_endsAt_idx" ON "LeaderboardPeriod"("scope", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "LeaderboardPeriod_offeringId_idx" ON "LeaderboardPeriod"("offeringId");

-- CreateIndex
CREATE INDEX "LeaderboardPeriod_ownerStudentId_idx" ON "LeaderboardPeriod"("ownerStudentId");

-- CreateIndex
CREATE INDEX "LeaderboardEntry_periodId_points_idx" ON "LeaderboardEntry"("periodId", "points");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_periodId_studentId_key" ON "LeaderboardEntry"("periodId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_periodId_rank_key" ON "LeaderboardEntry"("periodId", "rank");

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_ownerStudentId_fkey" FOREIGN KEY ("ownerStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSkill" ADD CONSTRAINT "StudentSkill_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSkill" ADD CONSTRAINT "StudentSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestConcept" ADD CONSTRAINT "QuestConcept_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestBlank" ADD CONSTRAINT "QuestBlank_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestAnswer" ADD CONSTRAINT "QuestAnswer_blankId_fkey" FOREIGN KEY ("blankId") REFERENCES "QuestBlank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestTest" ADD CONSTRAINT "QuestTest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyQuestAssignment" ADD CONSTRAINT "DailyQuestAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyQuestAssignment" ADD CONSTRAINT "DailyQuestAssignment_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestAttempt" ADD CONSTRAINT "QuestAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestAttempt" ADD CONSTRAINT "QuestAttempt_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestAttemptAnswer" ADD CONSTRAINT "QuestAttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuestAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestAttemptAnswer" ADD CONSTRAINT "QuestAttemptAnswer_blankId_fkey" FOREIGN KEY ("blankId") REFERENCES "QuestBlank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpTransaction" ADD CONSTRAINT "XpTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpTransaction" ADD CONSTRAINT "XpTransaction_questAttemptId_fkey" FOREIGN KEY ("questAttemptId") REFERENCES "QuestAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpTransaction" ADD CONSTRAINT "XpTransaction_classEnrollmentId_fkey" FOREIGN KEY ("classEnrollmentId") REFERENCES "ClassEnrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomOffering" ADD CONSTRAINT "ClassroomOffering_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassroomOffering" ADD CONSTRAINT "ClassroomOffering_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassWeek" ADD CONSTRAINT "ClassWeek_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ClassroomOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassQuest" ADD CONSTRAINT "ClassQuest_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "ClassWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassQuest" ADD CONSTRAINT "ClassQuest_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ClassroomOffering"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassQuestCompletion" ADD CONSTRAINT "ClassQuestCompletion_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "ClassEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassQuestCompletion" ADD CONSTRAINT "ClassQuestCompletion_classQuestId_fkey" FOREIGN KEY ("classQuestId") REFERENCES "ClassQuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassQuestCompletion" ADD CONSTRAINT "ClassQuestCompletion_questAttemptId_fkey" FOREIGN KEY ("questAttemptId") REFERENCES "QuestAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentBadge" ADD CONSTRAINT "StudentBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedBadge" ADD CONSTRAINT "PinnedBadge_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedBadge" ADD CONSTRAINT "PinnedBadge_studentBadgeId_fkey" FOREIGN KEY ("studentBadgeId") REFERENCES "StudentBadge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRelationship" ADD CONSTRAINT "FriendRelationship_lowStudentId_fkey" FOREIGN KEY ("lowStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRelationship" ADD CONSTRAINT "FriendRelationship_highStudentId_fkey" FOREIGN KEY ("highStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRelationship" ADD CONSTRAINT "FriendRelationship_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathLesson" ADD CONSTRAINT "PathLesson_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathLesson" ADD CONSTRAINT "PathLesson_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLessonProgress" ADD CONSTRAINT "StudentLessonProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentLessonProgress" ADD CONSTRAINT "StudentLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "PathLesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardPeriod" ADD CONSTRAINT "LeaderboardPeriod_offeringId_fkey" FOREIGN KEY ("offeringId") REFERENCES "ClassroomOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardPeriod" ADD CONSTRAINT "LeaderboardPeriod_ownerStudentId_fkey" FOREIGN KEY ("ownerStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "LeaderboardPeriod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
