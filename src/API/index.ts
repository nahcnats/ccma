import { NativeModules } from 'react-native';
import axios from 'axios';
import { IS_ANDROID } from '../utils';

const PROD_URL = 'https://be.cultcreative.asia/ccbs';
const STAGE_URL = 'https://stg.be.cultcreative.asia/ccbs';
const DEV_URL = 'https://dev.be.cultcreative.asia/ccbs';

// const BASE_URL = NativeModules.RNConfig.env === (IS_ANDROID ? 'internal' : 'Internal')  ? DEV_URL : PROD_URL;
let BASE_URL;

if (NativeModules.RNConfig.env === (IS_ANDROID ? 'internal' : 'Internal')) {
    BASE_URL = DEV_URL;
} else if (NativeModules.RNConfig.env === (IS_ANDROID ? 'staging' : 'Staging')) {
    BASE_URL = STAGE_URL;
} else {
    BASE_URL = PROD_URL;
}

const server = axios.create({
    baseURL: BASE_URL,
});

export default server;