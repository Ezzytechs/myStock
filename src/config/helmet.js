const isProduction = process.env.NODE_ENV === "production";

const FRONTEND_URL = "https://digitalmarketsqure.com";

module.exports = {
  contentSecurityPolicy: isProduction
    ? {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],

          // JS only from self (API)
          scriptSrc: ["'self'"],

          // Allow inline styles (React / Next / Tailwind safe)
          styleSrc: ["'self'", "'unsafe-inline'", FRONTEND_URL],

          // Images from frontend + data URLs
          imgSrc: ["'self'", FRONTEND_URL, "data:", "blob:"],

          // Fonts
          fontSrc: ["'self'", FRONTEND_URL, "data:"],

          // API calls from frontend
          connectSrc: ["'self'", FRONTEND_URL],

          // Disallow iframes entirely
          frameAncestors: ["'none'"],

          // Disable plugins
          objectSrc: ["'none'"],

          // Force HTTPS
          upgradeInsecureRequests: [],
        },
      }
    : false,

  frameguard: { action: "deny" },

  noSniff: true,
  xssFilter: true,

  hsts: isProduction
    ? {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true,
      }
    : false,

  hidePoweredBy: true,

  referrerPolicy: {
    policy: "strict-origin-when-cross-origin",
  },

  permissionsPolicy: {
    features: {
      geolocation: [],
      microphone: [],
      camera: [],
      payment: [],
      usb: [],
      fullscreen: ["self"],
    },
  },

  dnsPrefetchControl: { allow: false },

  crossOriginEmbedderPolicy: false, // usually breaks frontend builds
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
};
