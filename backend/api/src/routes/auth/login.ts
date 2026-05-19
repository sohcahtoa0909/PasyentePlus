//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = false;

import { validateEmail } from "../../lib/emailvalidate";
import { prisma } from "../../lib/prismaclient";

import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { Router } from "express";
const router: Router = Router();
router.post('/', async (req, res) => {
    let {        
        emailOrUserName,
        passwordAttempt
    } = req.body;

    emailOrUserName = (emailOrUserName as string).trim();

    const isValidEmail = validateEmail(emailOrUserName);

    const user = await prisma.user.findUnique({
        where: 
            isValidEmail ? {
                //Use email as basis for login
                emailAddress: emailOrUserName
            } : {
                //Use username as basis for login
                userName: emailOrUserName
            }
    });    
    if(!user) {
        return res.status(401).json({
            message: "Invalid credentials",            
        });
    }

    const isPasswordCorrect = await argon2.verify(user.hashedPassword, passwordAttempt);
    if(!isPasswordCorrect) {
        return res.status(401).json({
            message: "Password incorrect!",            
        });
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
    );

    res.status(200).json({
        token,
        user: { displayName: user.displayName, userName: user.userName, emailAddress: user.emailAddress, darkMode: user.darkMode, }
    });
});
export default router;