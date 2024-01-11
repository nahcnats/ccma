import { NativeModules } from 'react-native';
import { IS_ANDROID } from '../utils';

// 
const debugKey '';
const prodKey '';

const STRIPE_KEY = NativeModules.RNConfig.env === (IS_ANDROID ? 'external' : 'Enternal') ? prodKey : debugKey;

export default STRIPE_KEY;

