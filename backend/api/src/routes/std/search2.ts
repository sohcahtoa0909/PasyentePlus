//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = "/search2";
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
import { authenticateToken } from "../auth/authgate";
import { calculatePriceRange, calculatePriceRangeFromReports, calculateRating, calculateRatingFromReports, calculateWait, calculateWaitFromReports } from "../../lib/feedback";

const router: Router = Router();
router.get('/', async (req, res) => {
    try {
        const {
            facility_type, //Required
            service, //Optional
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

        if (service) {
            whereClause.services = {
                some: { service: { name: { contains: service as string, mode: 'insensitive' } } }
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
                        service: {
                            name: {
                                contains: service as string,
                                mode: 'insensitive'
                            }
                        }
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

        facilities = await Promise.all(facilities.map(async (f) => {
            const reportsFiltered = await prisma.feedbackReport.findMany({
                where: {
                    facilityId: f.id
                }
            });     
            
            const [ratingCount, ratingValue] = calculateRatingFromReports(reportsFiltered);
            const [hasWaitTime, waitTime] = calculateWaitFromReports(reportsFiltered);
            const [hasCostRange, minCost, maxCost] = calculatePriceRangeFromReports(reportsFiltered);

            return {
                ...f,
                ...(ratingCount! > 0 && { rating: ratingValue, ratingCount }),
                ...(hasWaitTime && { waitTime: waitTime }),
                ...(hasCostRange && { minCost: minCost, maxCost: maxCost })
            };
        }));        

        if (lat && lng) {
            const results = await Promise.all(facilities.map(async (f) => {
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
            res.json(facilities);
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