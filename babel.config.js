module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: 'usage',
        corejs: {
          version: 3,
          proposals: true, // 使用尚在“提议”阶段特性的 polyfill
        },
        targets: {
          node: '10',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    // 解决多个地方使用相同代码导致打包重复的问题
    ['@babel/plugin-transform-runtime'],
  ],
  ignore: ['node_modules/**'],
};