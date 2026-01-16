const backendClient = 'https://templateweb-miehe-alix-latest.onrender.com';

export const environment = {
  production: true,
  backendClient: backendClient,
  listPollution: backendClient + '/api/pollution',
  listUsers: backendClient + '/api/user',
  loginUser: backendClient + '/api/user/login'
};