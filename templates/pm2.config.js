module.exports = {
    apps : [
        {
          name: "My app",
          script: "./bin/www",
          watch: true,
          env: {
              "PORT": 5000,
              "NODE_ENV": "production"
          }
        }
    ]
  }