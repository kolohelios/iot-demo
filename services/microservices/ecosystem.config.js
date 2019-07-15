module.exports = {
  apps: [
    {
      name: 'levelGenerator',
      script: './build/levelGenerator.js',
      env: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster',
    },
    {
      name: 'averager',
      script: './build/averager.js',
      env: {
        NODE_ENV: 'production',
      },
      exec_mode: 'cluster',
    },
  ],
}
