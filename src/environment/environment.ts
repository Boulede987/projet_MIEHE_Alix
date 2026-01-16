const backendClient = 'http://localhost:443';

export const environment = {
  production: false,
  backendClient: backendClient,
  listPollution: backendClient + '/api/pollution',
  listUsers: backendClient + '/api/user',
  loginUser: backendClient + '/api/user/login'
};