import { LoaderContext, AssetInfo } from 'webpack';
import { getOptions, interpolateName } from 'loader-utils';
import { validate } from 'schema-utils';
import { JSONSchema7 } from 'json-schema';
import path from 'path';

import { normalizePath } from './util';
import schema from './options.json';

export interface JsonLoaderOptions {
  /** cdn 路径 */
  cdn?: string;
  /** 是否为esmodule */
  esModule?: boolean;
  /** publicPath 输出路径 */
  publicPath?: string;
  /** 执行路径 */
  context?: string;
  /** 文件名称 */
  name?: string;
  /** 正则 */
  regExp?: string;
}

/**
 * @description
 * 处理资源文件路径，转为cdn路径
 *
 * @param this
 * @param source
 * @returns
 */
function loader(this: LoaderContext<JsonLoaderOptions>, source: string | Buffer): void | string {
  const options = getOptions(this) as JsonLoaderOptions;
  const callback = this.async();

  validate(schema as JSONSchema7, options, {
    name: 'Cdn Loader',
    baseDataPath: 'optios',
  });

  /** cdn不存在则不处理 */
  if (!options.cdn) {
    return callback(null, source);
  }

  const { context, cdn, publicPath } = options;
  const { rootContext } = this;

  /** 文件名称 */
  let name = options.name || '[name]-[contenthash].[ext]';
  if (publicPath) {
    name = `${publicPath.endsWith('/') ? publicPath : `${publicPath}/`}${name}`;
  }

  const filename = interpolateName(this, name, {
    context: context || this.rootContext,
    content: source,
    regExp: options.regExp,
  });

  /**
   * @description
   * 文件输出路径，实际的文件系统写入路径
   */
  const fileOutputPath = filename;

  /**
   * @description
   * 文件的cdn访问路径拼接
   */
  const fileCdnUrl = `${cdn.endsWith('/')? cdn : `${cdn}/`}${filename}`;

  /**
   * @description assetInfo
   */
  const assetInfo: AssetInfo = {
    immutable: true,
    sourceFilename: normalizePath(
      path.relative(context || rootContext, this.resourcePath)
    )
  };
  /**
   * @description
   * webpack文件写入
   */
  this.emitFile(fileOutputPath, source, undefined, assetInfo);
  /**
   * @description
   * webpack模块导出
   */
  const { esModule } = options;

  /** 导出该文件路径 */
  const result = `${ esModule ? 'export default' : 'module.exports ='} "${fileCdnUrl}"`;
  console.log('[cdn-loader], result:', result);
  callback(null, result);
}

export default loader;

export const raw = true;