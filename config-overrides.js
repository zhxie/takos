const { override, addLessLoader, fixBabelImports } = require('customize-cra');

const customizeImageLoader = () => (config) => {
  config.module.rules[2].oneOf.push({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
    loader: 'file-loader'
  });
  return config;
};

module.exports = override(
  addLessLoader({
    strictMath: true,
    noIeCompat: true
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  }),
  customizeImageLoader()
);
