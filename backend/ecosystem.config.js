module.exports = {
    apps: [{
      name: "medusa",
      script: "./index.mjs", // El archivo principal de tu aplicación Express
      instances: "1",
      exec_mode: "cluster"
    }]
  };