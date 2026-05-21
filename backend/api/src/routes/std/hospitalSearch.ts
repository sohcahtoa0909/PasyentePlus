export const pathOverride: string = "/hospitals/search";
export const exclude: boolean = false;

import { prisma } from "../../lib/prismaclient";
import { Router } from "express";

const router: Router = Router();

router.get("/", async (req, res) => {
  try {
    const q = (req.query.q as string ?? "").trim();

    const hospitals = await prisma.hospital.findMany({
      where: q.length > 0
        ? { hospitalName: { contains: q, mode: "insensitive" as const } }
        : {},
      include: {
        facilities: {
          include: {
            type: true,
            reports: { select: { rating: true } },
          },
        },
      },
      orderBy: { hospitalName: "asc" as const },
      take: q.length > 0 ? 10 : 20,
    });

    const results = hospitals.map((h) => {
      const facilityTypes = [
        ...new Set(h.facilities.map((f: { type: { displayName: string } }) => f.type.displayName)),
      ];

      const allRatings = h.facilities.flatMap(
        (f: { reports: { rating: number }[] }) => f.reports.map((r) => r.rating)
      );
      const avgRating =
        allRatings.length > 0
          ? allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length
          : null;

      return {
        id: h.id,
        hospitalName: h.hospitalName,
        address: h.address ?? null,
        locLat: h.locLat,
        locLng: h.locLng,
        imageUrl: h.imageUrl ?? null,
        facilityTypes,
        avgRating,
        ratingCount: allRatings.length,
      };
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: `Error! ${err}` });
    console.error(err);
  }
});

export default router;
