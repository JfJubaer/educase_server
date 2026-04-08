const prisma = require("../config/db");
const getDistance = require("../utils/distance");

exports.addSchool = async (data) => {
  return await prisma.school.create({ data });
};

exports.getSchoolsSorted = async (userLat, userLon) => {
  const schools = await prisma.school.findMany();

  const sorted = schools.map((school) => {
    const distance = getDistance(
      userLat,
      userLon,
      school.latitude,
      school.longitude,
    );

    return { ...school, distance };
  });

  return sorted.sort((a, b) => a.distance - b.distance);
};
