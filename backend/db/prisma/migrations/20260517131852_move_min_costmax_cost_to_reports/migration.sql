/*
  Warnings:

  - You are about to drop the column `maxCost` on the `FacilityService` table. All the data in the column will be lost.
  - You are about to drop the column `minCost` on the `FacilityService` table. All the data in the column will be lost.
  - Added the required column `facilityServiceId` to the `FeedbackReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FacilityService" DROP COLUMN "maxCost",
DROP COLUMN "minCost";

-- AlterTable
ALTER TABLE "FeedbackReport" ADD COLUMN     "facilityServiceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_facilityServiceId_fkey" FOREIGN KEY ("facilityServiceId") REFERENCES "FacilityService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
