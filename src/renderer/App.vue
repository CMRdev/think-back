<template>
  <div id="app">
    <keep-alive include="landing-page">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'think-back',
    mounted () {
      var _this = this
      _this.$schedule.init({
        tasks: {
          // '1seconds': 1000,
          // '3seconds': 3000,
          // '5seconds': 5000,
          '10seconds': 10000
          // '30seconds': 30000
        },
        callBack: function (params) {
          _this.$EventBus.$emit(params.taskId, { taskId: params.taskId, mode: params.mode })
        }
      })
      // 开启定时任务
      _this.$schedule.start()
    }
  }
</script>

<style>
  html,body {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
    font-size: 14px;
    overflow: hidden;
  }
  #app {
    width: 100%;
    height: 100%;
    padding-top: 30px;
    box-sizing: border-box;
    
  }

  /* main constructure of page */
  #pager {
    width: 100%;
    height: 100%;
    background-color: var(--color-bg);
    display: flex;
    flex-direction: column;
    color: var(--color-text);
  }

  #pager header {
    height: 60px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid rgb(65,65,65);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
  }
  #pager main {
    flex: 1;
    width: 100%;
    padding: 0px 10px 0 20px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    flex-direction: column;
    display: flex;
    overflow: hidden;
  }
  #pager footer {
    height: 45px;
    width: 100%;
    padding-right: 10px;
    box-sizing: border-box;
    border-top: 1px solid rgb(65,65,65);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* button */
  .operation {
    width: auto;
    min-width: 60px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .operation .operation-btn {
    font-size: 12px;
    border: 1px solid rgb(65,65,65);
    padding: 5px;
    height: 14px;
    line-height: 14px;
    margin-left: 10px;
    border-radius: 5px;
  }
  .operation .operation-text {
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .operation .operation-btn:hover{
    border-color: var(--color-selected);
    background-color: var(--color-selected);
    color: var(--color-bg);
    cursor: pointer;
  }
  input,select {
    box-sizing: border-box;
    margin: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: "tnum";
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.5715;
    background-color: var(--color-bg-simple);
    background-image: none;
    border: 1px solid var(--color-bg-primar);
    border-radius: 3px;
    transition: all .3s;
    height:32px;
    outline: var(--color-selected);
  }
  input:focus,select:focus {
    border-color: var(--color-selected); 
  }
  .text-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden !important;
  }
</style>
