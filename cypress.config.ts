import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // 添加重试机制
    retries: {
      runMode: 2,
      openMode: 1
    },
    // 增加超时时间
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    // 视频和截图配置
    video: false,
    screenshotOnRunFailure: true,
    // 视口设置
    viewportWidth: 1280,
    viewportHeight: 720,
    // 基础 URL
    baseUrl: 'https://www.saucedemo.com',
    // 实验性功能
    experimentalModifyObstructiveThirdPartyCode: true
  },
  // 全局配置
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 60000
});
