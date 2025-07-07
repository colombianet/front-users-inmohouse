export const environment = {
  production: true,
  apiBaseUrl: (typeof process !== 'undefined' && process.env['NG_APP_API_URL']) || 'http://localhost:4200/api',
  appName: 'InmoHouse'
};
