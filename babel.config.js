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
          '@components': './src/Components',
          '@navigation': './src/Navigation',
          '@localization': './src/Other/Localization',
          '@styles': './src/Styles',
          '@native-base-custom': './native-base-theme',
          '@services': './src/Other/Services',
          '@constants': './src/Other/Constants',
          '@other': './src/Other',
        },
      },
    ],
    'jest-hoist',
  ],
};
