module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        cwd: 'babelrc',
        extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
        root: ['./src/'],
        alias: {
          '@src': './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@screens': './src/screens',
          '@styles': './src/styles',
          '@constants': './src/misc/constants',
          '@reducers': './src/reducers',
          '@misc': './src/misc',
        },
      },
    ],
    'jest-hoist',
  ],
};
