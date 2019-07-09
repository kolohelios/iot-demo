module.exports = {
  apps: [
    {
      name: 'levelGenerator',
      script: './node_modules/.bin/ts-node',
      args: './levelGenerator/index.ts',
      watch: ['./levelGenerator/**/*'],
      env: {
        NODE_ENV: 'development',
      },
      autorestart: false,
    },
  ],
}
