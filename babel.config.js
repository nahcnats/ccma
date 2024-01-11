module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'nativewind/babel', 
    'react-native-reanimated/plugin', // have to be last in the list
  ],
};
