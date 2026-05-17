/**
 * Reformats raw JSON response from backend API into suitable use for frontend use
 * 
 * @param {*} rawData JSON data returned from backend API
 * @returns {*} JSON data formatted for frontend use
 */
export const transformFacilityData = (rawData) => {
    return rawData.map((x) => {
        const recognizedServices = x.services.map((y) => {
            return y.service.displayName
        });

        return {
            facilityName: x.facilityName,

            hospitalId: x.hospitalId,
            hospitalName: x.hospital.hospitalName,

            locLat: x.hospital.locLat,
            locLng: x.hospital.locLng,

            distance: 50,
            waitTime: x.waitTime,

            priceLow: x.minCost,
            priceHigh: x.maxCost,

            rating: x.rating,
            ratingCount: x.ratingCount,

            services: recognizedServices
        }
    });
};

/**
 * Gets list of hospital location and name data to be presented in map view.
 * 
 * @param {*} facilities Transformed facility data
 * @returns {*} Returns associated data of hospital for map display
 */
export const getHospitalMarkers = (facilities) => {
    const hospitalMap = new Map();

    facilities.forEach(f => {
        if(!hospitalMap.has(f.hospitalId)) {
            hospitalMap.set(f.hospitalId, {
                position: [Number(f.locLat), Number(f.locLng)],
                name: f.hospitalName,
                popupContent: `<strong>${f.hospitalName}</strong>`
            });
        }
    });

    return Array.from(hospitalMap.values());
}


const REMAINDERMINUTES_CUTOFF = 20;
/**
 * Converts raw minutes into formatted/simplified form
 * 
 * @param {number} totalMinutes Number of minutes value
 * @returns {string} Formatted time to display
 */
export function formatDynamicWaitTime(totalMinutes) {
    if(totalMinutes <= 0) return "0m";

    const minsInHr = 60;
    const minsInDay = 24 * minsInHr;    

    if(totalMinutes >= minsInDay) {
        const days = Math.round(totalMinutes / minsInDay);
        return `${days}d`;
    }

    if(totalMinutes >= minsInHr) {
        const hours = Math.floor(totalMinutes / minsInHr);        
        const remainingMinutes = totalMinutes % minsInHr;

        return remainingMinutes > REMAINDERMINUTES_CUTOFF ?
        `${hours}-${hours+1}h` : `${hours}h`        
    }

    return `${totalMinutes}m`;
}