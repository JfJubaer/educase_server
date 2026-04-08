// Validation for adding school
const validateSchoolData = (req, res, next) => {
  const { name, address, latitude, longitude } = req.body;

  // Check if all fields exist
  if (!name || !address || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required: name, address, latitude, longitude",
    });
  }

  // Validate name
  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Name must be a non-empty string",
    });
  }

  // Validate address
  if (typeof address !== "string" || address.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Address must be a non-empty string",
    });
  }

  // Validate latitude
  const lat = parseFloat(latitude);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be a valid number between -90 and 90",
    });
  }

  // Validate longitude
  const lng = parseFloat(longitude);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be a valid number between -180 and 180",
    });
  }

  // Attach parsed values to request
  req.body.latitude = lat;
  req.body.longitude = lng;
  req.body.name = name.trim();
  req.body.address = address.trim();

  next();
};

// Validation for list schools query parameters
const validateLocationQuery = (req, res, next) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required query parameters",
    });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      success: false,
      message: "Latitude must be a valid number between -90 and 90",
    });
  }

  if (isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      success: false,
      message: "Longitude must be a valid number between -180 and 180",
    });
  }

  req.query.latitude = lat;
  req.query.longitude = lng;

  next();
};

module.exports = { validateSchoolData, validateLocationQuery };
