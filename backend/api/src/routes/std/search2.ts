//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = "/search2";
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { serialize } from "node:v8";
import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
import { authenticateToken } from "../auth/authgate";
import { calculateRating } from "../../lib/feedback";

const router: Router = Router();
router.get('/', async (req, res) => {
    try {
        const {
            facility_type, //Required
            service, //Optional
            max_price, //Price
            lat, lng //Location
        } = req.query;

        if(!facility_type) {
            return res.status(400).json({
                error: "Facility type is required"
            });
        }

        const whereClause: any = {
            type: {
                name: { contains: facility_type as string, mode: 'insensitive' }
            }
        };

        if (service || max_price) {
            whereClause.services = {
                some: {
                    AND: [
                        service ? { service: { name: { contains: service as string, mode: 'insensitive' } } } : {},
                        max_price ? { minCost: { lte: parseInt(max_price as string) } } : {},
                    ]
                }
            };
        }

        let facilities = await prisma.facility.findMany({
            where: {
                type: {
                    name: {
                        contains: facility_type as string,
                        mode: 'insensitive'
                    }
                },

                services: {
                    some: {
                        AND: [
                            service ? {
                                service: {
                                    name: {
                                        contains: service as string,
                                        mode: 'insensitive'
                                    }
                                }
                            } : {},

                            max_price ? {
                                minCost: {
                                    lte: parseInt(max_price as string)
                                }
                            } : {}
                        ]
                    }
                }
            },
            include: {
                hospital: true,
                type: true,
                services: {                     
                    include: { service: true }
                }
            }
        });        

        const facilitiesWithRating = await Promise.all(facilities.map(async (f) => {
            const [ratingCount, ratingValue] = await calculateAverageRating(f.id);
            
            return {
                ...f,
                ...(ratingCount! > 0 && { rating: ratingValue, ratingCount })
            };
        }));        

        if (lat && lng) {
            const results = await Promise.all(facilitiesWithRating.map(async (f) => {
                const hospital = f.hospital;

                const d = getDistance(
                    parseInt(lat as string),
                    parseInt(lng as string),
                    hospital.locLat, hospital.locLng);

                return {
                    ...f,
                    distance: d,                    
                }
            }));
            results.sort((a, b) => a.distance - b.distance);

            res.json(results);
        } else {
            res.json(facilitiesWithRating);
        }
    } catch (err) {
        res.status(500).json({error: 'Error!' });
    }
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