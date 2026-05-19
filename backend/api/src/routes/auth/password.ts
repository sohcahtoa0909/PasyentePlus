// Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
// Set if you don't want this file to be read
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";
import { authenticateToken } from "./authgate";
import argon2 from "argon2";

import { Router } from "express";
const router: Router = Router();

// PATCH /auth/password — change the logged-in user's password
router.patch("/", authenticateToken, async (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId: string = req.user.userId;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Both current and new password are required." });
  }

  if ((newPassword as string).length < 8) {
    return res.status(400).json({ message: "New password must be at least 8 characters." });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // Verify the current password is correct before allowing a change
  const isCorrect = await argon2.verify(user.hashedPassword, currentPassword);
  if (!isCorrect) {
    return res.status(401).json({ message: "Current password is incorrect." });
  }

  const hashedPassword = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data:  { hashedPassword },
  });

  return res.status(200).json({ message: "Password changed successfully." });
});

export default router;