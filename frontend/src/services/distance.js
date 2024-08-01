const toRadians = (degrees) => degrees * (Math.PI / 180);

export const calculateDistance = (restLatitude, restLongitude, userLatitude, userLongitude) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(restLatitude - userLatitude);
    const dLon = toRadians(restLongitude - userLongitude);
    const lat1 = toRadians(userLatitude);
    const lat2 = toRadians(restLatitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(3);
};
