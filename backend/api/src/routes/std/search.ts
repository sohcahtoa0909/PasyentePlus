//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = "/search";
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { error } from "node:console";
import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
const router: Router = Router();
router.get('/', async (req, res) => {
    
    const searchParams = req.query;

    const lat = parseFloat(searchParams.lat as string);
    const lng = parseFloat(searchParams.lng as string);
    const svcName = searchParams.service;

    if(!svcName) {
        res.json({
            error: "Missing service"
        });
    }
    
    const facilities = await prisma.facility.findMany({
        where: {
            services: {
                some: {
                    service: {
                        name: svcName as string,
                    },
                    isAvailable: true
                },
            },
        },
        include: {
            hospital: true,
            services: {
                where: {
                    service: {
                        name: svcName as string,
                    },
                },
                include: {
                    service: true,
                },
            },
        },
    });

    const results = facilities.map((f) => {
        const hospital = f.hospital;
        const service = f.services[0];

        const d = getDistance(
            lat, lng, hospital.locLat, hospital.locLng
        );

        return {
            hospitalName: hospital.hospitalName,
            facilityName: f.facilityName,
            service: service?.service.name,
            minCost: service?.minCost ?? null,
            maxCost: service?.maxCost ?? null,
            isAvailable: service?.isAvailable ?? false,
            distanceKm: d,
        };
    });

    results.sort((a,b)=> a.distanceKm - b.distanceKm);

    res.json(results);
});
export default router;

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}