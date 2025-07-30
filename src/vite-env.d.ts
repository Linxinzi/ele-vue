interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // 声明其他自定义环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.png' {
  const src: string
  export default src
}
