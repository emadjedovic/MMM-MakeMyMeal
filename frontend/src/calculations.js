const toRadians = (degrees) => degrees * (Math.PI / 180);

export const calculateDistance = (
  restLatitude,
  restLongitude,
  userLatitude,
  userLongitude
) => {
  const R = 6371;
  const dLat = toRadians(restLatitude - userLatitude);
  const dLon = toRadians(restLongitude - userLongitude);
  const lat1 = toRadians(userLatitude);
  const lat2 = toRadians(restLatitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // in meters

  return distance.toFixed(0);
};

export const originalPrice = (priceOnDiscount, discount) => {
  const original = priceOnDiscount / (1 - discount);
  return Math.round(original * 100) / 100;
};

export const formatDiscount = (discount) => {
  if (discount !== null) {
    return `${Math.round(discount * 100)}%`;
  }
  return "N/A";
};

export const PercentageToFraction = (percentage) => {
  return (percentage / 100).toFixed(2);
};

export const formatCreatedAt = (dateString) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
