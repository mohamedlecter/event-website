const ENV = {
  development: {
    API_URL: 'http://localhost:4000/api',
    UPLOAD_URL: 'http://localhost:4000/uploads',
    SERVER_URL:'http://localhost:4000',
    STRIPE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  },
  production: {
    API_URL: 'https://api.e-tickets.online/api',
    UPLOAD_URL: 'https://api.e-tickets.online/uploads',
    SERVER_URL: 'https://api.e-tickets.online',
    STRIPE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
  }
};

// Get current environment from environment variable or default to development
const currentEnv = process.env.REACT_APP_ENV || 'development';

// Export the configuration for the current environment
export const config = ENV[currentEnv];

// Helper function to get API URL
export const getApiUrl = () => config.API_URL;

// Helper function to get Upload URL
export const getUploadUrl = () => config.UPLOAD_URL;

// Helper function to get Server URL
export const getServerUrl = () => config.SERVER_URL;

// Helper function to get Stripe key
export const getStripeKey = () => config.STRIPE_KEY;

console.log("config", config.API_URL);

export default config; 