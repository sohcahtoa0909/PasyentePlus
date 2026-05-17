export const transformFacilityData = (rawData) => {
    return rawData.map((x) => {
        const recognizedServices = x.services.map((y) => {
            return y.service.displayName
        });

        const minPrices = x.services.map(z => z.minCost);
        const maxPrices = x.services.map(z => z.maxCost);

        const priceLow = Math.min(...minPrices);
        const priceHigh = Math.max(...maxPrices);

        return {
            facilityName: x.facilityName,

            hospitalId: x.hospitalId,
            hospitalName: x.hospital.hospitalName,

            locLat: x.hospital.locLat,
            locLng: x.hospital.locLng,

            priceLow, priceHigh,

            distance: 50,
            waitTime: 50,

            rating: x.rating,
            ratingCount: x.ratingCount,

            services: recognizedServices
        }
    });
};

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