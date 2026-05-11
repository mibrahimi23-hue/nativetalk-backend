import { Platform } from 'react-native';

const DEV_IP = '172.20.10.2';

export const BASE_URL = __DEV__
  ? Platform.OS === 'web'
    ? 'http://localhost:8000/api/v1'
    : `http://${DEV_IP}:8000/api/v1`
  : 'https://meticulous-acceptance-production-ffa9.up.railway.app/api/v1';