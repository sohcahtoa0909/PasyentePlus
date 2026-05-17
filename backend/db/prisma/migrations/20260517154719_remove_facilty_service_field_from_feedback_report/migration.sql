/*
  Warnings:

  - You are about to drop the column `facilityServiceId` on the `FeedbackReport` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeedbackReport" DROP CONSTRAINT "FeedbackReport_facilityServiceId_fkey";

-- AlterTable
ALTER TABLE "FeedbackReport" DROP COLUMN "facilityServiceId";
