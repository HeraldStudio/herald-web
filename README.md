# herald-web

小猴偷米 Web (PWA) 项目

## 开发

推荐使用 yarn 安装依赖，再执行开发脚本。脚本将会监听本地 8080 端口。

```bash
yarn
npm run dev
```

## 部署

我们建议在服务器端 `git clone`，并在服务端执行部署脚本，这是比较优雅且更接近持续集成的部署方式。

```bash
yarn
npm run build
```

部署脚本将并打包生成文件到 `dist` 目录；为了防止在生成前破坏 `dist` 目录导致线上不能访问，打包脚本将会先生成到 `dist-tmp` 目录，待生成完毕后再替换现有 `dist` 目录。

## 需要注意的点

1. Service Worker (`sw.js`) 是 parcel-plugin-sw-cache 在 parcel 打包后才执行的，不被 parcel 打包；

2. 由于 parcel 环境与 webpack 不同，本项目 pug 中不支持使用驼峰属性名，需要手动改写成中划线，否则会变成全小写；如果要全项目排查驼峰属性名，可以用正则全文搜索 `[a-z]*[A-Z][a-z]*=['"]`；

3. `package.json` 中 `babel` 的 `module-resolver` 插件可以代替 `webpack` 中的 `alias` 功能，其中设置了 `@` 代表 `src` 文件夹，`static` 代表 `static` 文件夹；之所以在那里配置 `"vue": "vue/dist/vue"` 是因为 `vue` 的 `package.json` 会默认指向 `vue/dist/vue-common`，导致运行时错误。

4. `static` 文件夹并不是真的静态，其中的图片或其他资源需要 import，之后将会变成生成后的路径字符串，可以插入图片的 `src` 中使用，这一点与 React 中的使用方式类似。

## 开发规范

- 请使用二空格缩进；
- 请使用规范的 `pug`/`es7 stage-0`/`stylus` 书写；
- 请熟悉 Chrome 或 Safari 的移动端模拟调试功能，并至少同时对 **桌面端、Pad 端、手机网页、小程序** 四种环境进行测试；
- 项目代码 100% 面向业务逻辑，**工具函数或工具类请做成轮子再使用或找相关轮子使用，不要随地堆放工具代码**。

## 参与开发或反馈

我们鼓励校内同学在本项目中以 Issue 的方式提出反馈，如有开发能力，欢迎提出 PR。
