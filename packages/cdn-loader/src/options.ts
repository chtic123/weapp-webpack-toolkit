export default {
  type: 'object',
  properties: {
    esModule: {
      type: 'boolean'
    },
    name: {
      type: 'string'
    },
    publicPath: {
      type: 'string'
    },
    context: {
      description: 'A custom file context (https://github.com/webpack-contrib/file-loader#context).',
      type: 'string'
    },
    regExp: {
      description: 'A Regular Expression to one or many parts of the target file path. The capture groups can be reused in the name property using [N] placeholder (https://github.com/webpack-contrib/file-loader#regexp).',
      anyOf: [
        {
          type: 'string'
        },
        {
          instanceof: 'RegExp'
        }
      ]
    }
  }
};