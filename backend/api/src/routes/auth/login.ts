//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { Router } from "express";
const router: Router = Router();
router.get('/', async (req, res) => {
    // Get POST request body
    const { userName, passwordAttempt } = await req.body;

    // Check if user exist
    const user = await prisma.user.findUnique({
        where: {
            userName
        }
    });
    if(!user) return res.status(401).json({
        message: "User does not exist"
    });

    // Check if password correct
    const isPasswordCorrect = argon2.verify(user.passwordHash, passwordAttempt);
    if(!isPasswordCorrect) return res.status(401).json({ message: "Password is incorrect" });

    // Generate JWT token
    const token = jwt.sign(
        { userid: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );

    // Return response
    res.json({
        token,
        user: {
            displayName: user.displayName
        }
    });
});
export default router;