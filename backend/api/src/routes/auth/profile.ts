// Set API route overrides here, otherwise use NULL to simply use the file structure
export const pathOverride: String | null = null;
// Set if you don't want this file to be read
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";
import { authenticateToken } from "./authgate";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { Router } from "express";
const router: Router = Router();

// PATCH /auth/profile — update username and/or darkMode preference
router.patch("/", authenticateToken, async (req: any, res) => {
  const userId: string = req.user.userId;
  const { userName, darkMode } = req.body;

  // Build update payload with only the fields that were sent
  const data: { userName?: string; darkMode?: boolean } = {};

  if (userName !== undefined) {
    const trimmed = (userName as string).trim();
    if (!trimmed) {
      return res.status(400).json({ message: "Username cannot be empty." });
    }
    data.userName = trimmed;
  }

  if (darkMode !== undefined) {
    data.darkMode = Boolean(darkMode);
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "Nothing to update." });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return res.status(200).json({
      message:  "Profile updated successfully.",
      userName: updated.userName,
      darkMode: updated.darkMode,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(400).json({ message: "That username is already taken." });
    }
    throw e;
  }
});

export default router;