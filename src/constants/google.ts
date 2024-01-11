import { NativeModules } from 'react-native';
import { IS_ANDROID } from '../utils';

const debugKey = 'AIzaSyDGk-57YfUwdlJrtizbod2HKrrz4LGT_8A';
const prodKey = 'AIzaSyDGk-57YfUwdlJrtizbod2HKrrz4LGT_8A';

// const GOOGLE_KEY = NativeModules.RNConfig.env === (IS_ANDROID ? 'external' : 'External') ? prodKey : debugKey;
const GOOGLE_KEY = 'AIzaSyDGk-57YfUwdlJrtizbod2HKrrz4LGT_8A';

export default GOOGLE_KEY;