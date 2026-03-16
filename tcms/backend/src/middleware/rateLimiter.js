const rateLimit = require('express-rate-limit');

/* General API — 300 req / 15 min per IP */
const global = rateLimit({
  windowMs:   15 * 60 * 1000,
  max:         300,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many requests. Please wait 15 minutes.' },
});

/* Auth endpoints — 20 attempts / 15 min per IP */
const auth = rateLimit({
  windowMs:   15 * 60 * 1000,
  max:         20,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
});

module.exports = { global, auth };