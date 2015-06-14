var serverConfig = {
  develop: {
    appName: 'acgDB-test',
    forceRedirectToHttps: false,
    stickySession: {
      enable: false,
      num: 4,
      proxy: true,
      header: 'x-forwarded-for'
    },
    hostname: process.env.BASE_URI || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    clientTemplate: '../acgDBClient/dist/index.mustache',
    staticDirectory: '../acgDBClient/dist',
    faviconPath: '../acgDBClient/dist/favicon.ico',
    prerenderServiceUrl: process.env.PRERENDER_SERVICE_URL || 'http://service.prerender.io/',
    googleAnalyticsTracking: process.env.GOOGLE_ANALYTICS_TRACKING || null,
    disqusShortname: null
  },
  production: {
    appName: 'acgDB',
    forceRedirectToHttps: true,
    stickySession: {
      enable: false,
      num: process.env.WORKERS || process.env.WEB_CONCURRENCY || 2,
      proxy: true,
      header: 'x-forwarded-for'
    },
    hostname: process.env.BASE_URI || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    clientTemplate: 'public/index.mustache',
    staticDirectory: 'public',
    faviconPath: 'public/favicon.ico',
    prerenderServiceUrl: process.env.PRERENDER_SERVICE_URL || 'http://service.prerender.io/',
    googleAnalyticsTracking: process.env.GOOGLE_ANALYTICS_TRACKING || null,
    disqusShortname: 'acgDB'
  }
};

var _config = serverConfig.develop;
if (serverConfig.production !== undefined && process.env.NODE_ENV == 'production') {
  _config = serverConfig.production;
}

module.exports = _config;
