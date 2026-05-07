//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

// import { prisma } from "../../lib/prismaclient";
import { authenticateToken } from "./authgate";

import { Router } from "express";
const router: Router = Router();
router.get('/', authenticateToken, (req, res) => {
    res.status(200).json({
        message: "Hello world from Authentication!"
    });
});
export default router;