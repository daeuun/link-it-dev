module.exports = {
  apps: [{
    name: process.env.pm2_name || `app-${process.env.PORT || 3000}`,
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    interpreter: 'node', // 시스템 기본 노드로 지정
    error_file: './log/error.log',
    out_file: './log/access.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    env: {
      NODE_ENV: 'prod'
    },
  }]
};