import { PrismaClient } from ".prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    // 🔹 Facility Types
    const dentist = await prisma.facilityType.upsert({
        where: { name: "DENTIST" },
        update: {},
        create: { name: "DENTIST" },
    });

    const dialysis = await prisma.facilityType.upsert({
        where: { name: "DIALYSIS" },
        update: {},
        create: { name: "DIALYSIS" },
    });

    const er = await prisma.facilityType.upsert({
        where: { name: "EMERGENCY ROOM" },
        update: {},
        create: { name: "EMERGENCY ROOM" },
    });

    // 🔹 Service Types
    const cleaning = await prisma.serviceType.create({
        data: {
            name: "Cleaning",
            facilityTypeId: dentist.id,
        },
    });

    const braces = await prisma.serviceType.create({
        data: {
            name: "Braces",
            facilityTypeId: dentist.id,
        },
    });

    const consultation = await prisma.serviceType.create({
        data: {
            name: "Consultation",
            facilityTypeId: er.id,
        },
    });

    // 🔹 Hospitals
    const hospitalA = await prisma.hospital.create({
        data: {
            hospitalName: "Davao Medical Center",
            locLat: 7.0731,
            locLng: 125.6128,
            address: "Davao City",
        },
    });

    const hospitalB = await prisma.hospital.create({
        data: {
            hospitalName: "Brokenshire Hospital",
            locLat: 7.065,
            locLng: 125.6,
            address: "Davao City",
        },
    });

    // 🔹 Facilities
    const dentistA = await prisma.facility.create({
        data: {
            facilityName: "DMC Dentist",
            hospitalId: hospitalA.id,
            typeId: dentist.id,
        },
    });

    const dentistB = await prisma.facility.create({
        data: {
            facilityName: "Brokenshire Dentist",
            hospitalId: hospitalB.id,
            typeId: dentist.id,
        },
    });

    // 🔹 Facility Services (Costs + Availability)
    await prisma.facilityService.createMany({
        data: [
            {
                facilityId: dentistA.id,
                serviceId: cleaning.id,
                minCost: 800,
                maxCost: 1200,
                isAvailable: true,
            },
            {
                facilityId: dentistA.id,
                serviceId: braces.id,
                minCost: 40000,
                maxCost: 70000,
                isAvailable: true,
            },
            {
                facilityId: dentistB.id,
                serviceId: cleaning.id,
                minCost: 700,
                maxCost: 1000,
                isAvailable: true,
            },
            {
                facilityId: dentistB.id,
                serviceId: braces.id,
                isAvailable: false, // doesn't offer braces
            },
        ],
    });

    // Create new users
    await prisma.user.create({
        data: {
            displayName: `Pasyente Plus`,
            userName: `pasyenteplus`,
            emailAddress: `pasyente.plus@pasyenteplus.org`,
            hashedPassword: await argon2.hash("pasyentepassword")
        }
    });

    console.log("✅ Seed data inserted");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });