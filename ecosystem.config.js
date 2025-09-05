/* eslint-env node */
module.exports = {
  apps: [
    {
      name: "simple-node-backend",
      cwd: "/opt/apps/simple-node-backend",
      script: "./current/dist/server.js",
      env_file: "./current/.env", // ← loads NODE_ENV and PORT from SSM
      autorestart: true,
    },
  ],
};
