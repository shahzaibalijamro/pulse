process.env.PORT = "5001";
process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://127.0.0.1:27017/pulse-test";
process.env.REDIS_URL = "redis://127.0.0.1:6379";
process.env.JWT_SECRET = "test-jwt-secret-that-is-long-enough";
process.env.JWT_EXPIRES_IN = "7d";
process.env.CLIENT_ORIGIN = "http://localhost:3000";
process.env.COOKIE_SECRET = "test-cookie-secret-that-is-long-enough";
