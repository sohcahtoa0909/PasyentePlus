//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../../lib/prismaclient";
import argon2 from "argon2"

import { Router } from "express";
const router: Router = Router();
router.post('/', async (req, res) => {
    const { userName, displayName, rawPassword, emailAddress } = req.body;

    const hashedPassword = await argon2.hash(rawPassword);

    try {
        const newUser = prisma.user.create({
            data: {
                userName: userName,
                displayName: displayName,
                passwordHash: hashedPassword
            }
        });

        return res.status(409).json({ message: "Successfully created your account" })
    } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
                console.log(
                    "Cannot create new user because either that username or email is taken!"
                );
            }

            return res.status(409).json({ message: `Could not create a new account because of error: ${e.cause}` });
        }
    }
});
export default router;