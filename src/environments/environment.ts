// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { version } from '../../package.json'

export const environment = {
  appVersion: version + '-dev',
  production: false,
  //API_BASE_URL_AUTHORIZATION: 'http://localhost:50025/sec-autho',
  //API_BASE_URL_AUTHENTICATION: 'http://localhost:50025/sec-authe',
  API_BASE_URL_AUTHORIZATION: 'http://localhost:52025',
  API_BASE_URL_AUTHENTICATION: 'http://localhost:53025',
  API_BASE_URL_GENERAL_MASTERS: 'http://localhost:54025',
  API_BASE_URL_OSM_MASTERS: 'http://localhost:55025',
  API_BASE_URL_MPC: 'http://localhost:56025',
  API_BASE_URL_OSM_IMS: 'http://localhost:57025'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
