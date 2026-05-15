import { PrismaClient } from ".prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import argon2 from "argon2";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main2() {
    // FACILITY TYPES    
    const FACILITY_DIALYSIS = await prisma.facilityType.upsert({
        where: { name: "dialysis" },
        update: {},
        create: { name: "dialysis", displayName: "Renal Dialysis" }
    });

    const FACILITY_DENTIST = await prisma.facilityType.upsert({
        where: { name: "dentist" },
        update: {},
        create: { name: "dentist", displayName: "Dentistry" }
    });

    //FACILITY SERVICES - DIALYSIS
    const SVC_DIALYSIS_HEMODIALYSIS = await prisma.serviceType.create({
        data: {
            name: `${FACILITY_DIALYSIS.name}-hemodialysis`,
            displayName: "Hemodialysis",
            facilityTypeId: FACILITY_DIALYSIS.id,
        }
    });

    const SVC_DIALYSIS_HEMODIAFILTRATION = await prisma.serviceType.create({
        data: {
            name: `${FACILITY_DIALYSIS.name}-hemofiltration`,
            displayName: "Hemodiafiltration",
            facilityTypeId: FACILITY_DIALYSIS.id,
        }
    });

    //FACILITY SERVICES - RADIOLOGY
    const SVC_DENTIST_CLEANING = await prisma.serviceType.create({
        data: {
            name: `${FACILITY_DENTIST.name}-cleaning`,
            displayName: "Tooth Cleaning",
            facilityTypeId: FACILITY_DENTIST.id,
        }
    });

    const SVC_DENTIST_EXTRACTION = await prisma.serviceType.create({
        data: {
            name: `${FACILITY_DENTIST.name}-extract`,
            displayName: "Tooth Extraction",
            facilityTypeId: FACILITY_DENTIST.id,
        }
    });

    //HOSPITALS
    const HOSPITAL_DAVAODOC = await prisma.hospital.create({
        data: {
            hospitalName: "Davao Doctors Hospital",
            locLat: 7.0732375,
            locLng: 125.5631621,
            address: "Davao City",
        }
    });
    const CLINIC_DAVAODOC_DUMOY = await prisma.facility.create({
        data: {
            facilityName: "Dumoy Care Center",
            hospitalId: HOSPITAL_DAVAODOC.id,
            typeId: FACILITY_DIALYSIS.id,
        },
    });

    const HOSPITAL_FRESEN = await prisma.hospital.create({
        data: {
            hospitalName: "Fresenius Kidney Care",
            locLat: 7.0981136,
            locLng: 125.6200707,
            address: "Davao City"
        }
    });
    const CLINIC_FRESEN = await prisma.facility.create({
        data: {
            facilityName: "Fresenius Kidney Care",
            hospitalId: HOSPITAL_FRESEN.id,
            typeId: FACILITY_DIALYSIS.id,
        },
    });

    const HOSPITAL_UNICARE = await prisma.hospital.create({
        data: {
            hospitalName: "UniCare Medical Clinic",
            locLat: 7.0150013,
            locLng: 125.4958463,
            address: "Davao City"
        }
    });
    const CLINIC_UNICARE_DIALYSIS = await prisma.facility.create({
        data: {
            facilityName: "UniCare Medical Clinic Dialysis Center",
            hospitalId: HOSPITAL_UNICARE.id,
            typeId: FACILITY_DIALYSIS.id,
        },
    });
    const CLINIC_UNICARE_DENTIST = await prisma.facility.create({
        data: {
            facilityName: "UniCare Medical Clinic Dental Clinic",
            hospitalId: HOSPITAL_UNICARE.id,
            typeId: FACILITY_DENTIST.id,
        },
    });

    const HOSPITAL_BROKENSHIRE = await prisma.hospital.create({
        data: {
            hospitalName: "Brokenshire Medical Center",
            locLat: 7.0749707,
            locLng: 125.5971094,
            address: "Davao City"
        }
    });
    const CLINIC_BKSH_DENTIST = await prisma.facility.create({
        data: {
            facilityName: "Dr. Villagomeza Dental Clinic",
            hospitalId: HOSPITAL_BROKENSHIRE.id,
            typeId: FACILITY_DENTIST.id,
        },
    });
    const CLINIC_BKSH_DIALYSIS = await prisma.facility.create({
        data: {
            facilityName: "Renal Dialysis Unit",
            hospitalId: HOSPITAL_BROKENSHIRE.id,
            typeId: FACILITY_DIALYSIS.id,
        },
    })

    await prisma.facilityService.createMany({
        data: [
            {
                facilityId: CLINIC_DAVAODOC_DUMOY.id,
                serviceId: SVC_DIALYSIS_HEMODIAFILTRATION.id,
                minCost: 5000,
                maxCost: 7500,
                isAvailable: true,
            },

            {
                facilityId: CLINIC_FRESEN.id,
                serviceId: SVC_DIALYSIS_HEMODIAFILTRATION.id,
                minCost: 6000,
                maxCost: 8500,
                isAvailable: true,
            },
            {
                facilityId: CLINIC_FRESEN.id,
                serviceId: SVC_DIALYSIS_HEMODIALYSIS.id,
                minCost: 3500,
                maxCost: 4500,
                isAvailable: true,
            },

            {
                facilityId: CLINIC_UNICARE_DIALYSIS.id,
                serviceId: SVC_DIALYSIS_HEMODIALYSIS.id,
                minCost: 4000,
                maxCost: 5230,
                isAvailable: true,
            },

            {
                facilityId: CLINIC_UNICARE_DENTIST.id,
                serviceId: SVC_DENTIST_CLEANING.id,
                minCost: 500,
                maxCost: 1500,
                isAvailable: true,
            },

            {
                facilityId: CLINIC_BKSH_DIALYSIS.id,
                serviceId: SVC_DIALYSIS_HEMODIAFILTRATION.id,
                minCost: 5000,
                maxCost: 7350,
                isAvailable: true,
            },
            {
                facilityId: CLINIC_BKSH_DIALYSIS.id,
                serviceId: SVC_DIALYSIS_HEMODIALYSIS.id,
                minCost: 4500,
                maxCost: 6200,
                isAvailable: true,
            },

            {
                facilityId: CLINIC_BKSH_DENTIST.id,
                serviceId: SVC_DENTIST_CLEANING.id,
                minCost: 350,
                maxCost: 1250,
                isAvailable: true,
            },
            {
                facilityId: CLINIC_BKSH_DENTIST.id,
                serviceId: SVC_DENTIST_EXTRACTION.id,
                minCost: 2500,
                maxCost: 3500,
                isAvailable: true,
            },
        ]
    });

    // Create new users
    await prisma.user.create({
        data: {
            displayName: process.env.ADMIN_DNAME!,
            userName: process.env.ADMIN_UNAME!,
            emailAddress: process.env.ADMIN_EMAIL!,
            hashedPassword: await argon2.hash(process.env.ADMIN_PASSWORD!)
        }
    });

    console.log("INFO: DB seeding successful!");
}

/*
async function main() {
    // 🔹 Facility Types
    const dentist = await prisma.facilityType.upsert({
        where: { name: "dentist" },
        update: {},
        create: { name: "dentist" },
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
            displayName: process.env.ADMIN_DNAME!,
            userName: process.env.ADMIN_UNAME!,
            emailAddress: process.env.ADMIN_EMAIL!,
            hashedPassword: await argon2.hash(process.env.ADMIN_PASSWORD!)
        }
    });

    console.log("INFO: DB seeding successful!");
}
*/

main2()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });