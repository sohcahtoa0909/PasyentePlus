//Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
//Set if you don't want this file to be read 
export const exclude: boolean = true;

import jwt from "jsonwebtoken";

export const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];    
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            message: "No authorization provided"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET!, 
        (err: any, decoded: any) => {
            if (err) return res.status(403).json({
                message: "Invalid session token!"
            });
            req.user = decoded;            
            next();
        }
    );
};