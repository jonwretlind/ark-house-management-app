module.exports = {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://your-azure-frontend-domain.com',
  nodeEnv: 'production'
}; 