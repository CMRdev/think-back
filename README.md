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

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
