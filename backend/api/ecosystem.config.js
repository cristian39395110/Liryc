module.exports = {
    apps: [{
      name: "medusa-api",
      script: "./api.mjs", // El archivo principal de tu aplicación Express
      instances: "3",
      exec_mode: "cluster"
    }]
  };