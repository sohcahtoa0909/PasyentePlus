//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = true;

// import { prisma } from "../../lib/prismaclient";

import { Router } from "express";
const router: Router = Router();
router.get('/', (req, res) => {
    res.send('Hello world!');

    //CODE GOES HERE
    
});
export default router;