import { version } from '../../package.json'

export const environment = {
  appVersion: version,
  production: true,
  API_BASE_URL_AUTHORIZATION: 'http://192.168.14.15:52025',
  API_BASE_URL_AUTHENTICATION: 'http://192.168.14.15:53025',
  API_BASE_URL_GENERAL_MASTERS: 'http://192.168.14.15:54025',
  API_BASE_URL_OSM_MASTERS: 'http://192.168.14.15:55025',
  API_BASE_URL_MPC: 'http://192.168.14.15:56025',
  API_BASE_URL_OSM_IMS: 'http://192.168.14.15:57025'
};
