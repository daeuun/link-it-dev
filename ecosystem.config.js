module.exports = {
  apps: [{
    name: `linkit-app`,
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    error_file: './log/error.log',
    out_file: './log/access.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    env: {
      NODE_ENV: 'prod'
    },
  }]
};