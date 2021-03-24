export const environment = {
    appVersion: require('../../package.json').version + '-dev',
    production: false,
    API_BASE_URL_AUTHORIZATION: 'http://localhost:52025',
    API_BASE_URL_AUTHENTICATION: 'http://localhost:53025',
    API_BASE_URL_GENERAL_MASTERS: 'http://localhost:54025',
    API_BASE_URL_OSM_MASTERS: 'http://localhost:55025',
    API_BASE_URL_MPC: 'http://localhost:56025',
    API_BASE_URL_OSM_IMS: 'http://localhost:57025'
  };
