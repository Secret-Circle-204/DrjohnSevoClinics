/**
 * PM2 Process Management & Application Monitoring Configuration
 * Standard Linux Production Deployment for Dr. John Sevo Dental Clinic Application
 * Reference: docs/Website-component and technology-.pdf (Page 3)
 */
module.exports = {
  apps: [
    {
      name: 'john-sevo-dental-clinic',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
