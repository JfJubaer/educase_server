const service = require("../services/school.service");

exports.addSchool = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Validation
    if (!name || !address || latitude == null || longitude == null) {
      return res.status(400).json({ message: "All fields required" });
    }

    const school = await service.addSchool({
      name,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    res.status(201).json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listSchools = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Coordinates required" });
    }

    const schools = await service.getSchoolsSorted(
      Number(latitude),
      Number(longitude),
    );

    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
