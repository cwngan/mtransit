function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export default function getDistance(points: { lat: string; lon: string }[]) {
  let ans = 0;
  for (let i = 0; i < points.length - 1; i++) {
    ans += getDistanceFromLatLonInKm(
      parseFloat(points[i].lat),
      parseFloat(points[i].lon),
      parseFloat(points[i + 1].lat),
      parseFloat(points[i + 1].lon),
    );
  }
  return ans;
}
