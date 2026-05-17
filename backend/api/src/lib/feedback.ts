import { prisma } from "./prismaclient";

/**
 * Calculates the star-rating value of a Facility in a hospital.
 * 
 * @param facilityId - Facility by facilityID in database in which to get the rating
 * @returns {[number, number]} - Returns triple [x, y] - x is how many ratings total, and y is the star-rating value
 */
export async function calculateRating(facilityId: string) {
    // Get all report items
    const reportsFiltered = await prisma.feedbackReport.findMany({
        where: {
            facilityId: facilityId as string
        }
    });    

    // 
    if(reportsFiltered.length <= 0) {
        return [0, 0];
    }

    const ratings = reportsFiltered.map(f => f.rating);

    const average = ratings.reduce((a, b) => a + b) / ratings.length;

    return [ratings.length, average];
}