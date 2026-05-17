import { prisma } from "./prismaclient";

/**
 * Calculates the star-rating value of a Facility in a hospital.
 * 
 * @param facilityId Facility by facilityID in database in which to get the rating
 * @returns {[number, number]} Returns tuple [x, y] - x is how many ratings total, and y is the star-rating value
 */
export async function calculateRating(facilityId: string) {
    // Get all report items
    const reportsFiltered = await prisma.feedbackReport.findMany({
        where: {
            facilityId: facilityId as string
        }
    });    

    // If no reports exists
    if(reportsFiltered.length <= 0) {
        return [0, 0];
    }

    // Create array of just ratings
    const ratings = reportsFiltered.map(f => f.rating);

    // Get average
    const average = ratings.reduce((a, b) => a + b) / ratings.length;

    return [ratings.length, average];
}

/**
 * Calculates the median wait time of a facility.
 * 
 * @todo Improve the implementation of this function to be weighted-median based on reportAge (in minutes) property
 * 
 * @param facilityId Facility by facilityID in database in which to get the rating
 * @returns {[boolean, number]} Returns tuple [x, y] where x is if there is a valid calculation and y is the Median wait time
 */
export async function calculateWait(facilityId: string) {
    // Get all report items
    const reportsFiltered = await prisma.feedbackReport.findMany({
        where: {
            facilityId: facilityId as string
        }
    });   

    // If no reports exists
    if(reportsFiltered.length <= 0) {
        return [false, -1];
    }

    //Get all times
    const waitTimes = reportsFiltered
    .filter(f => f.timeIn !== null && f.timeOut !== null)
    .filter(f => f.timeOut! > f.timeIn!)
    .map(f => {
        const waitTimeInMins = (f.timeOut!.getTime() - f.timeIn!.getTime()) / (1000 * 60);
        const reportAge = (Date.now() - f.createdAt.getTime()) / (1000 * 60);

        return {
            waitTime: waitTimeInMins,
            reportAge        
        }
    });

    return [true, getWaitTimeMedian(waitTimes)];
}

/**
 * Gets the median time of waitTime instances
 * 
 * @param {{waitTime: number, reportAge: number}[]} Array of instances of waitTimes
 * @returns {number} Median number of minutes waited
 */
function getWaitTimeMedian(waitTimes: {waitTime: number, reportAge: number}[]) {
    waitTimes = [...waitTimes].sort((a, b) => a.waitTime - b.waitTime);

    const half = Math.floor(waitTimes.length / 2);

    return (waitTimes.length % 2 ? 
        waitTimes[half]?.waitTime :
        (waitTimes[half - 1]!.waitTime + waitTimes[half]!.waitTime) / 2
    );
}