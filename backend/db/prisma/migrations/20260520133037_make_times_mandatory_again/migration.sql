/*
  Warnings:

  - Made the column `timeIn` on table `FeedbackReport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `timeOut` on table `FeedbackReport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FeedbackReport" ALTER COLUMN "timeIn" SET NOT NULL,
ALTER COLUMN "timeOut" SET NOT NULL;
