//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
const router: Router = Router();
router.get('/', async (req, res) => {
    const {
        facilityId
    } = req.query;

    if(!facilityId) {
        return res.status(400).json({
            message: "facilityId must be supplied"
        });
    }

    const pics = await prisma.facilityPhoto.findMany({
        where: {
            facilityId: facilityId as string
        }
    });

    const urls = pics.map(p => {
        return `/static${p.photoUrl}`
    });

    return res.status(200).json({
        urls
    })
});
export default router;