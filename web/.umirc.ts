import {defineConfig} from 'umi';


const theme = {
  "primary-color": "#1961AC",
  "success-color": "#52c41a",
  "warning-color": "#faad14",
  "error-color": "#ff4d4f"
}

// @ts-ignore
export default defineConfig({
  webpack5: {},
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  antd: {
    compact: true, // 开启紧凑主题
  },
  locale: {antd: true},

  // 使用相对路径加载， 默认是绝对位置
  publicPath: './',


  // 升级antd最新包后出现报错
  // https://github.com/ant-design/ant-design-pro/issues/9082#issuecomment-925609753
  lessLoader: {
    // golbalVars: {
    //   'root-entry-name': 'default'
    // }
    modifyVars: {
      'root-entry-name': 'default'
    }
  },


  /**
   * 配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存。
   */
  hash: true,


  /** 修改主题颜色 **/
  theme: theme,


  ignoreMomentLocale:true,

  /**
   * 为每个页面输出 html
   * 渲染和 url 解绑，html 文件放哪都能使用
   */
  mpa:{},
  outputPath:"../src/main/resources/static/flowable"
});
