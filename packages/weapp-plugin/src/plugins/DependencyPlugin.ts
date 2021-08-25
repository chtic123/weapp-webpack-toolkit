import path from 'path';
import { Compiler } from 'webpack';
import { createResolver, removeExt, Resolver } from '../utils/resolver';
import { IDependencyPluginOptions } from '../types/DependencyPlugin';
import { addEntryFactory, getAppEntry } from '../utils/dependency';
import { DependencyTree } from '../modules/dependency/DependencyTree';

/**
 * 处理小程序依赖以及依赖分析
 */
export class DependencyPlugin {
  static PLUGIN_NAME = 'DependencyPlugin';

  ignore: Array<string | RegExp>;

  /** 小程序项目根文件夹，app.json 所在目录 */
  context!: string;

  /** 模块路径解析器 */
  resolver!: Resolver;

  /** 依赖树 */
  dependencyTree: DependencyTree;

  /** 添加 entry 函数 */
  addEntry!: (entryPath: string, chunkName: string) => void;

  constructor(options: IDependencyPluginOptions) {
    this.ignore = options.ignore || [];
    this.dependencyTree = options.dependencyTree;
  }

  apply(compiler: Compiler): void {
    const app = getAppEntry(compiler);

    this.context = path.dirname(app);
    this.resolver = createResolver(compiler, this.context);
    this.addEntry = addEntryFactory(compiler).bind(this, this.context);
    this.dependencyTree = new DependencyTree({
      context: this.context,
      app,
      resolver: this.resolver,
      compiler,
    });

    compiler.hooks.entryOption.tap(DependencyPlugin.PLUGIN_NAME, () => {
      this.setAllEntries(compiler);
      return true;
    });

    // compiler.hooks.afterCompile.tap(DependencyPlugin.PLUGIN_NAME, (compilation) => {
    //   console.info('skr: compilation', compilation.chunks);
    // });
  }

  /**
   * 添加项目所有依赖
   */
  setAllEntries(compiler: Compiler): void {
    this.dependencyTree.build();
    const chunks = this.dependencyTree.chunks;

    Object.keys(chunks).map((chunkName) => {
      const entries = this.dependencyTree.getChunkEntries(chunkName);
      const assets = this.dependencyTree.getChunkAssets(chunkName);

      entries.forEach((entry) => {
        this.addEntry(entry, removeExt(path.basename(entry)));
      });

      // assets.forEach((asset) => this.addEntry(asset, chunkName));
    });
  }
}