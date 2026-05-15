/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `FacilityType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ServiceType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `ServiceType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `displayName` to the `FacilityType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayName` to the `ServiceType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FacilityType" ADD COLUMN     "displayName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServiceType" ADD COLUMN     "displayName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FacilityType_displayName_key" ON "FacilityType"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceType_name_key" ON "ServiceType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceType_displayName_key" ON "ServiceType"("displayName");
