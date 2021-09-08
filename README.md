# think-back

> An electron-vue project
### Storage

- 目前存储在内部的indexDB中。借助`Dexie.js`操作IndexDB.不考虑接入sqlite3 or其他外部数据库，因为够用也不需要暴露太多东西处理。

#### Build Setup

``` bash
# clone to local dir.
git clone xxx
cd think-back
# Using yarn install all dependencies.
yarn
npm run dev

npm run buildWin

```

#### Distribution issues

``` bash
1、下载github上文件失败（nsis-v.xxx.7z）：
  可手动下载完解压放到 C:\Users\Administrator\AppData\Local\electron-builder\Cache\nsis
2、当你的电脑用户名是中文时：
  打开 node_module/app-builder-lib/out/targets/nsis/NsisTarget.js文件，在 executeMakensis 方法中加入我们所需的参数：args.push("-INPUTCHARSET", "UTF8"); // 中文名问题
```

---
