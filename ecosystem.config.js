require('dotenv').config()

const PROJECT_NAME = 'pup'
const NODE_VERSION = '12.6.0'
const SSH_USER = process.env.SSH_USER


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
      user : SSH_USER,
      host : process.env.HOST,
      ref  : 'origin/master',
      repo : process.env.REPO,
      path : `/home/${SSH_USER}/apps/${PROJECT_NAME}`,
      'post-deploy' : `/home/${SSH_USER}/.nvm/versions/node/v${NODE_VERSION}/bin/npm install && /home/${SSH_USER}/.nvm/versions/node/v${NODE_VERSION}/bin/pm2 reload ecosystem.config.js --env production`
    }
  }
}
