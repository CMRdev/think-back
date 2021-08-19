<template>
  <div class="landing-page">
    <section class="title-area">
      <div class="search-area">
        <select v-model="filterType">
          <option value="all">ALL</option>
          <template v-for="(type, index) in typeList">
            <option :key="index" :value="type.value">{{ type.label }}</option>
          </template>
        </select>
        <input v-model="filterKeyword" placeholder="请输入标题" />
      </div>
      <div class="operation-btn" v-if=" filterType != 'all' || (filterKeyword != null && filterKeyword.length > 0) " > Clear&nbsp; </div>
      <div class="operation-btn">&nbsp;Create</div>
    </section>
    <section class="content-area">
      <div class="left-body"></div>
      <div class="right-list"></div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  components: {},
  props: {},
  data () {
    return {
      filterType: 'all',
      filterKeyword: '',
      typeList: [
        { label: 'English', value: 'eng' }
      ]
    }
  },
  watch: {},
  computed: {},
  methods: {},
  created () { },
  mounted () { }
}
</script>

<style lang="scss" scoped>
.landing-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title-area {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .search-area {
      flex: 1;
      height: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      > select {
        height: 30px;
        width: 120px;
        margin-right: 10px;
        border-radius: 3px;
      }
      > input {
        height: 24px;
        flex: 1;
        padding-left: 10px;
      }
    }
    .operation-btn {
      width: 80px;
      height: 28px;
      margin-left: 10px;
      border: 1px solid #ccc;
      border-radius: 3px;
      text-align: center;
      line-height: 30px;
    }
  }
  .content-area {
    width: 100%;
    flex: 1;
    .left-body {
      width: 80%;
      height: 100%;
      padding: 20px;
      overflow: auto;
    }
    .right-list {
      width: 20%;
      height: 100%;
    }
  }
}
</style>
