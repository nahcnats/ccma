import { NativeModules } from 'react-native';
import { IS_ANDROID } from '../utils';

// const debugKey = 'pk_test_51JN6cnDG0Mz61LdvhJ1kKzHhO3Zk9ZU2PUgLG4iZwns8CWT6XDzitrQNZbvW1Gb4T1lugbGe8oUBizcFzeo3omaE00gY9WW3nJ';
const debugKey = 'pk_test_51I66uRBnEgMMNm4yKLdb4IV7KK5HzzLaff6o3frCgkAdC6Q71Hj5kXJd0h3ms0Ebfx8ozptMXFOl63knzGuBAaZy00OTJZdISl';
const prodKey = 'pk_live_51I66uRBnEgMMNm4yFipgoPtperwJHYGHEgl34ELk68tkHMhCFqW8MeRYmPxXKf55p8tILhz72qVeNic9DkSgUojh00nD0tcSQN';

const STRIPE_KEY = NativeModules.RNConfig.env === (IS_ANDROID ? 'external' : 'Enternal') ? prodKey : debugKey;

export default STRIPE_KEY;

