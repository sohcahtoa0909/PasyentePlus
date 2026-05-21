//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";
import { authenticateToken } from "../auth/authgate"

import { Router } from "express";
const router: Router = Router();
router.post('/', authenticateToken, async (req, res) => {
    try {
        const {
            facilityId,
            rating,
            moneySpent,
            textComment,
            timeIn, timeOut
        } = req.body;        

        const reporterId = req.user?.userId;
        if (!reporterId) {
            return res.status(401).json({
                message: "Unauthorized: user data not present in auth token"
            });
        }

        const mostRecentReport = await prisma.feedbackReport.findFirst({
            where: {
                reporterId: reporterId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        if (mostRecentReport !== null) {
            const dateDiff = Date.now() - mostRecentReport.createdAt.getTime();
            const dateDiffHrs = Math.floor(dateDiff / (1000 * 60 * 60));

            if (dateDiffHrs < 24) {
                return res.status(429).json({
                    message: "You've made a report too recently!"
                });
            }
        }

        const newReport = await prisma.feedbackReport.create({
            data: {
                facilityId,
                rating,
                reporterId: reporterId,
                timeIn, timeOut,

                moneySpent: (moneySpent !== undefined && moneySpent !== null && moneySpent !== "")
                    ? Number(moneySpent)
                    : null,
                textComment: textComment || undefined,
            }
        });

        return res.status(200).json(newReport);
    } catch (err) {
        console.error(`ERROR at (${err})`)
        return res.status(500).json({
            message: err instanceof Error ? err.message : String(err)
        });
    }

});
export default router;