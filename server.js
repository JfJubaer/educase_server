const app = require("./src/app");
const { testConnection } = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Test database connection before starting server
const startServer = async () => {
  const isDatabaseConnected = await testConnection();

  if (!isDatabaseConnected) {
    console.error("❌ Cannot start server: Database connection failed");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(` Add School: POST http://localhost:${PORT}/addSchool`);
    console.log(` List Schools: GET http://localhost:${PORT}/listSchools`);
  });
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

// Start the server
startServer();
