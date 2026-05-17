import { prisma } from "./prismaclient";

//
export async function calculateAverageRating(facilityId: string) {
    const facility = await prisma.feedbackReport.findMany({
        where: {
            facilityId: facilityId as string
        }
    });    

    if(facility.length <= 0) {
        return [false, -1];
    }

    const ratings = facility.map(f => f.rating);

    const average = ratings.reduce((a, b) => a + b) / ratings.length;

    return [true, average];
}