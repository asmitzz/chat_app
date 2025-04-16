module.exports = {
    apps: [
      {
        name: 'server-app',
        script: './src/app.js', 
        // exec_mode: 'fork', 
        // If you want to use all available CPU cores (production-ready)
        exec_mode: 'fork',
        instances: 1,
        env: {
          NODE_ENV: 'development',
        },
      },
    ],
  };
  