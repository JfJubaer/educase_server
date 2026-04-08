const { pool } = require("../config/database");

// Haversine formula to calculate distance between two coordinates (in kilometers)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Add new school
const addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Check if school already exists (optional)
    const [existing] = await pool.query(
      "SELECT id FROM schools WHERE name = ? AND address = ?",
      [name, address],
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "School already exists with this name and address",
      });
    }

    // Insert new school
    const [result] = await pool.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude],
    );

    res.status(201).json({
      success: true,
      message: "School added successfully",
      data: {
        id: result.insertId,
        name,
        address,
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// List all schools sorted by proximity
const listSchools = async (req, res) => {
  try {
    const { latitude: userLat, longitude: userLng } = req.query;

    // Fetch all schools
    const [schools] = await pool.query("SELECT * FROM schools");

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No schools found",
        data: [],
      });
    }

    // Calculate distance for each school and sort
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLng,
        school.latitude,
        school.longitude,
      ),
    }));

    // Sort by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      message: "Schools retrieved successfully",
      user_location: {
        latitude: userLat,
        longitude: userLng,
      },
      total_schools: schoolsWithDistance.length,
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error listing schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { addSchool, listSchools };
