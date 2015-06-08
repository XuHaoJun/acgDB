var _config = {
  facebook: {
    clientID: (
      process.env.OAUTH2_FACEBOOK_CLIENT_ID ||
        'YourFacebookClientID'
    ),
    clientSecret: (
      process.env.OAUTH2_FACEBOOK_CLIENT_SECRET ||
                   'YourFacebookClientSecret'
    ),
    callbackURL: (
      process.env.OAUTH2_FACEBOOK_CALLBACK_URL ||
        'http://localhost:3000/auth/facebook/callback'
    ),
    profileFields: ['id', 'displayName', 'emails'],
    enableProof: false
  },

  google: {
    clientID: (
      process.env.OAUTH2_GOOGLE_CLIENT_ID ||
        'YourGoogleClientID'
    ),
    clientSecret: (
      process.env.OAUTH2_GOOGLE_CLIENT_SECRET ||
        'YourGoogleClientSecret'
    ),
    callbackURL: (
      process.env.OAUTH2_GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/google/callback'
    )
  }
};

module.exports = _config;
