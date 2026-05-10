//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";
import { validateEmail } from "../../lib/emailvalidate";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import argon2 from "argon2"

import { Router } from "express";
const router: Router = Router();
router.post('/', async (req, res) => {
    let {
        firstName,
        lastName,
        userName,
        emailAddress,
        givenPassword
    } = req.body;

    firstName = (firstName as string).trim();
    lastName = (lastName as string).trim();    
    userName = (userName as string).trim();
    emailAddress = (emailAddress as string).trim();

    if(!validateEmail(emailAddress.trim())) {
        return res.status(400).json({
            message: "Invalid email address"
        });
    }

    try {
        const hashedPassword = await argon2.hash(givenPassword);

        const newUser = await prisma.user.create({
            data: {
                displayName: `${firstName} ${lastName}`,
                userName: userName,
                emailAddress: emailAddress,
                hashedPassword: hashedPassword
            }
        });

        return res.status(200).json({
            message: "Successfully signed up!",
            displayName: newUser.displayName
        });
    } catch (e) {
        if(e instanceof PrismaClientKnownRequestError) {
            if(e.code === "P2002") {
                return res.status(400).json({
                    message: "Cannot create this user"
                });
            }
        }
        throw e;
    }
});
export default router;