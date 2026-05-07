//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
const router: Router = Router();
router.get('/', async (req, res) => {
    
    const facis = await prisma.facility.findMany({
        include: {
            hospital: true
        }
    });    

    const formattedFacis = facis.map((f: any) => ({
        id: f.id,
        facilityName: `${f.hospital.hospitalName} - ${f.facilityName}`,
        hospitalId: f.hospitalId,
        type: f.type
    }));

    res.json(formattedFacis);

});
export default router;