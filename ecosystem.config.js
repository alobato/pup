require('dotenv').config()

const PROJECT_NAME = 'pup'
const NODE_VERSION = '12.6.0'

module.exports = {
  apps : [{
    name: PROJECT_NAME,
    script: 'app.js',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }],

  deploy : {
    production : {
      user : process.env.USER,
      host : process.env.HOST,
      ref  : 'origin/master',
      repo : process.env.REPO,
      path : `/home/${USER}/apps/${PROJECT_NAME}`,
      'post-deploy' : `/home/${USER}/.nvm/versions/node/v${NODE_VERSION}/bin/npm install && /home/${USER}/.nvm/versions/node/v${NODE_VERSION}/bin/pm2 reload ecosystem.config.js --env production`
    }
  }
}
