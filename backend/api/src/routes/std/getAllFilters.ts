//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = "/getsearchfilters";
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
const router: Router = Router();
router.get('/', async (req, res) => {

    let retVal = await prisma.serviceType.findMany({
        include: {
            facilityType: true
        }
    });

    res.json(retVal);
});
export default router;