const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Time to Chat - API",
      version: "1.0.0",
      description: "A simple Express Node API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  // Path to the API docs
  apis: ["./routes/auth.js"], // adjust this pattern to where your route files are
};

module.exports = swaggerJsDoc(swaggerOptions);
