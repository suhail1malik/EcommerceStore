module.exports = {
  apps: [
    {
      name: "ecommerce-backend",
      script: "./index.js",
      instances: "max", // Uses all available CPU cores
      exec_mode: "cluster", // Enables node clustering
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
