import { handleAsset } from '../common';
import { Handler, HandlerRunner } from '../handler-runner';

export class WxmlHandler<T> implements Handler<T> {
  static HANDLER_NAME = 'WxmlHandler';

  apply(runner: HandlerRunner<T>): void {
    // runner.hooks.beforeHandleAssets.tap(WxmlHandler.HANDLER_NAME, (code) => {
    //   return esModule ? `export default \`${code}\`;` : `module.exports = \`${code}\``;
    // });

    runner.hooks.handleNormalAsset.tapPromise(
      WxmlHandler.HANDLER_NAME,
      handleAsset.bind(this, 'WXML_DEPENDENCY', runner),
    );
  }
}
