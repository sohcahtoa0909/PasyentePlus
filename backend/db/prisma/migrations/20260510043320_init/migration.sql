-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "hospitalName" TEXT NOT NULL,
    "locLat" DOUBLE PRECISION NOT NULL,
    "locLng" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "facilityName" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "facilityTypeId" TEXT NOT NULL,

    CONSTRAINT "ServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FacilityType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityService" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "minCost" INTEGER,
    "maxCost" INTEGER,
    "isAvailable" BOOLEAN,
    "notes" TEXT,

    CONSTRAINT "FacilityService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackReport" (
    "id" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "timeIn" TIMESTAMP(3) NOT NULL,
    "timeOut" TIMESTAMP(3) NOT NULL,
    "moneySpent" INTEGER,
    "textComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacilityType_name_key" ON "FacilityType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FacilityService_facilityId_serviceId_key" ON "FacilityService"("facilityId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailAddress_key" ON "User"("emailAddress");

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Facility" ADD CONSTRAINT "Facility_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "FacilityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceType" ADD CONSTRAINT "ServiceType_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "FacilityType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityService" ADD CONSTRAINT "FacilityService_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacilityService" ADD CONSTRAINT "FacilityService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackReport" ADD CONSTRAINT "FeedbackReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
