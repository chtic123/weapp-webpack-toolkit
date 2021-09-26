import { replaceExt, shortid } from '@weapp-toolkit/core';
import { IWeappComponentConfig, IWeappPageConfig } from '@weapp-toolkit/weapp-types';
import path from 'path';
import { handleAsset } from '../common';
import { Handler, HandlerRunner } from '../handler-runner';

export class JsonHandler<T> implements Handler<T> {
  static HANDLER_NAME = 'JsonHandler';

  apply(runner: HandlerRunner<T>): void {
    const { loaderContext, appRoot, resolver, placeholderMap } = runner;
    const { resourcePath } = loaderContext;

    runner.hooks.normalAsset.tapPromise(JsonHandler.HANDLER_NAME, handleAsset.bind(this, 'JSON_DEPENDENCY', runner));

    runner.hooks.after.tap(JsonHandler.HANDLER_NAME, (code) => {
      const filename = path.relative(appRoot, resourcePath);
      const json: IWeappComponentConfig | IWeappPageConfig = JSON.parse(code);
      const { usingComponents } = json;

      if (usingComponents) {
        Object.keys(usingComponents).forEach((identify) => {
          const referencePath = usingComponents[identify];
          const resolvedReference = replaceExt(resolver.resolveDependencySync(appRoot, referencePath), '.json');

          const placeholder = `___JSON_DEPENDENCY_${shortid()}___`;
          /** 记录占位符和资源的映射，在还原的时候需要**特别兼容** json 类型文件 */
          placeholderMap.set(placeholder, {
            reference: resolvedReference,
            shouldRemoveExt: true,
          });

          usingComponents[identify] = placeholder;
        });
      }

      /** 生成文件 */
      loaderContext.emitFile(filename, JSON.stringify(json), undefined, {
        placeholderMap: runner.placeholderMap,
      });

      /** json 需要透传给 webpack */
      return code;
    });
  }
}