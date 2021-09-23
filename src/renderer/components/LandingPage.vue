<template>
  <div id="pager" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <header>
      <div class='search-area'>
        <select v-model="filterType" @change="search(true)">
          <option value='all'>ALL</option>
          <template v-for="(language, index) in languages">
            <option :key="index" :value="language.value">{{language.label}}</option>
          </template>
        </select>
        <input v-model="filterKeyword" @input="search(true)" placeholder="Search thinks！" />
      </div>
      <div class='operation'>
        <div class='operation-btn' v-if='filterType !="all" || filterKeyword != null && filterKeyword.length > 0'
          @click="clear">Clear&nbsp;</div>
        <div class='operation-btn' @click="goToEditor">&nbsp;Create</div>
      </div>
    </header>
    <main>
      <div class="main-left">
        <div v-if='!searching && !selectedThink' class='tips-msg'>No records.</div>
        <div v-else style="height: 100%;">
          <div class="left-title text-ellipsis" :title="selectedThink.title">{{ selectedThink.title }}</div>
          <div class="left-date">
            <span class="text-ellipsis" v-show="selectedThink.description"
              :title="selectedThink.description">描述：{{ selectedThink.description || '--' }}</span>
            <span class="text-ellipsis">更新日期：{{ selectedThink.date | formatDate }}</span>
          </div>
          <div class="left-content" :style="`font-size:${fontSize}px;`">
            <codemirror ref="myCodemirror" :value="selectedThink.content" :options="cmOptions" @ready="onCmReady">
            </codemirror>
          </div>
        </div>
      </div>
      <div class="main-right">
        <div v-if='searching' class='tips-msg'>
          <div class="pswp__preloader__icn">
            <div class="pswp__preloader__cut">
              <div class="pswp__preloader__donut"></div>
            </div>
          </div>&nbsp;&nbsp;LOADING
        </div>
        <div v-if='!searching && thinks.length == 0' class='tips-msg'>No records.</div>
        <ul v-show='!searching'>
          <template v-for='(think, index) in thinks'>
            <li :key="index" @click="selectItem(think, index)" :class="{'selected': selectedThink.id === think.id }">
              <div class='number'>{{ (currentPage - 1) * pageSize + index + 1 }}.</div>
              <div class='title text-ellipsis' :title="think.title">{{ think.title || '--' }}</div>
              <div class='operation'>
                <span class='operation-btn' @click="goToEditor(think.id)">Edit</span>
                <span class='operation-btn' @click="remove(think.id)">Remove</span>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </main>
    <footer>
      <theme-selector @themeChange='themeChange'></theme-selector>
      <div class='pager' v-if='totalRecords > 0'>
        <div class='operation' style='justify-content:start'>
          <div class='font-selector'>
            <span>font-size:&nbsp;</span>
            <select v-model="fontSize">
              <option value=14>14</option>
              <option value=18>18</option>
              <option value=22>22</option>
              <option value=26>26</option>
              <option value=30>30</option>
            </select>
          </div>
          <div class='sort-selector'>
            <span>Sort:&nbsp;</span>
            <select v-model="filterOrder" @change="search(true)">
              <option value='date'>Recently updated</option>
              <option value='id'>Recently created</option>
            </select>
          </div>
          <select v-model='pageSize' @change="search(true)" style='height: 25px;line-height:25px'>
            <option value=10>10</option>
            <option value=30>30</option>
            <option value=90>90</option>
            <option value=120>120</option>
          </select>
          <div class='operation-text'>
            &nbsp;&nbsp;total:&nbsp;{{totalRecords}}&nbsp;&nbsp;{{currentPage}}/{{totalPage}}&nbsp;&nbsp;</div>
          <span class='operation-btn' v-if='currentPage != 1' @click="pageQuery(currentPage--)">prev</span>
          <span class='operation-btn' v-if='currentPage < totalPage' @click="pageQuery(currentPage++)">next</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import ThemeSelector from './Theme'
import LanguageSupport from './mixins/Language'
export default {
  name: 'landing-page',
  mixins: [LanguageSupport],
  components: { ThemeSelector },
  data () {
    return {
      totalRecords: 0,
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      thinks: [],
      selectedThink: {},
      filterType: 'all',
      filterKeyword: null,
      filterOrder: 'id',
      searchTimeout: null,
      searching: false,
      newVersion: false,
      currentTheme: 0,
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        height: '100%',
        readOnly: true,
        nocursor: true
      },
      count: 0,
      isHovering: false,
      fontSize: 14,
      codemirror: null
    }
  },
  methods: {
    themeChange () {
      this.refreshTheme()
      this.onCmReady()
    },
    refreshTheme () {
      const currentTheme = Number(window.localStorage.getItem('CURRENT_THEME'))
      if (currentTheme === 0) {
        this.cmOptions.theme = 'base16-dark'
      } else {
        this.cmOptions.theme = 'base16-light'
      }
    },
    onCmReady () {
      this.codemirror && this.codemirror.setOption('theme', this.cmOptions.theme)
      this.codemirror && this.codemirror.refresh()
    },
    clear () {
      this.filterType = 'all'
      this.filterKeyword = null
      this.search(true)
    },
    themeSelector (themeKey) {
      this.currentTheme = themeKey
      const link = document.querySelector('link[name="theme"]')
      if (this.currentTheme === 0) {
        link.href = '/static/black.css'
        this.cmOptions.theme = 'base16-dark'
      } else {
        link.href = '/static/light.css'
        this.cmOptions.theme = 'base16-light'
      }
      // flush to localstorage.
      window.localStorage.setItem('CURRENT_THEME', this.currentTheme)
    },
    updatePager () {
      this.totalPage = this.totalRecords % this.pageSize === 0 ? this.totalRecords / this.pageSize : Math.ceil(this.totalRecords / this.pageSize)
    },
    getPagerOffset () {
      return (this.currentPage - 1) * this.pageSize
    },
    goToEditor (id) {
      this.$router.push('/editor/' + id)
    },
    pageQuery (page) {
      console.log(this.currentPage)
      this.search()
    },
    search (reset = false) {
      if (reset) {
        this.currentPage = 1
      }
      this.searching = true
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.loadList()
      }, 300)
    },
    loadList () {
      this.thinks = []
      if (this.filterType !== 'all' && this.filterKeyword) {
        this.$thinkbackDB.think
          .filter(record => {
            return record.type === this.filterType
          })
          .filter(record => {
            return JSON.stringify(record).indexOf(this.filterKeyword) > -1
          })
          .count(res => {
            this.totalRecords = res
            this.$thinkbackDB.think.orderBy(this.filterOrder).desc()
              .filter(record => record.type === this.filterType)
              .filter(record => {
                return JSON.stringify(record).indexOf(this.filterKeyword) > -1
              })
              .offset(this.getPagerOffset())
              .limit(this.pageSize)
              .toArray((thinks) => {
                this.bindList(thinks)
              })
          })
      } else if (this.filterType !== 'all') {
        this.$thinkbackDB.think
          .filter(record => { return record.type === this.filterType })
          .count(res => {
            this.totalRecords = res
            this.$thinkbackDB.think.orderBy(this.filterOrder).desc()
              .filter(record => { return record.type === this.filterType })
              .offset(this.getPagerOffset())
              .limit(this.pageSize)
              .toArray((thinks) => {
                this.bindList(thinks)
              })
          })
      } else if (this.filterKeyword) {
        this.$thinkbackDB.think
          .filter(record => {
            return JSON.stringify(record).indexOf(this.filterKeyword) > -1
          }).count(res => {
            this.totalRecords = res
            this.$thinkbackDB.think.orderBy(this.filterOrder).desc()
              .filter(record => {
                return JSON.stringify(record).indexOf(this.filterKeyword) > -1
              }).offset(this.getPagerOffset()).limit(this.pageSize)
              .toArray((thinks) => {
                this.bindList(thinks)
              })
          })
      } else {
        this.$thinkbackDB.think.count(res => {
          this.totalRecords = res
          this.$thinkbackDB.think.orderBy(this.filterOrder).desc()
            .offset(this.getPagerOffset()).limit(this.pageSize)
            .toArray((thinks) => {
              this.bindList(thinks)
            })
        })
      }
    },
    bindList (thinks) {
      this.thinks = thinks
      this.searching = false
      this.selectItem(this.thinks.length && this.thinks[0])
      this.updatePager()
    },
    selectItem (item, index) {
      this.selectedThink = item
      this.codemirror && this.codemirror.setOption('mode', this.selectedThink.type)
      this.codemirror && this.codemirror.refresh()
    },
    remove (id) {
      require('electron').remote.dialog.showMessageBox({
        type: 'error',
        buttons: ['ok', 'cancel'],
        title: 'Alert',
        detail: 'Are your sure to remove this think?'
      }, (btn) => {
        if (btn === 0) {
          this.$thinkbackDB.think.delete(id).then(status => {
            this.loadList()
          })
        }
      })
    },
    changeThink () {
      if (this.isHovering) return
      if (this.thinks && this.thinks.length > this.count) {
        this.selectItem(this.thinks[this.count])
        this.count++
      } else if (this.thinks && this.thinks.length <= this.count) {
        this.count = 0
      }
    }
  },
  mounted () {
    this.codemirror = this.$refs.myCodemirror && this.$refs.myCodemirror.codemirror
    this.loadList()
    this.newVersion = window.localStorage.getItem('NEW_VERSION') === '1'
    this.$EventBus.$on('5seconds', this.changeThink)
  },
  activated () {
    // hook for keep alive components acitved.
    this.search(true)
  },
  filters: {
    formatDate (time) {
      if (!time) return '--'
      let date = new Date(time)
      let fmt = 'yyyy-MM-dd hh:mm:ss'
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  }
}
</script>
<style lang="scss" scoped>
#pager main {
  display: flex;
  flex-direction: row;
  .main-left {
    width: 70%;
    height: 100%;
    .left-title {
      width: 100%;
      height: 30px;
      font-size: 20px;
      text-align: center;
      line-height: 30px;
    }
    .left-date {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      > span:first-child {
        margin-right: 20px;
        max-width: 60%;
      }
      > span {
        max-width: 200px;
      }
    }
    .left-content {
      width: 100%;
      height: calc(100% - 50px);
      padding: 10px 10px 10px 0;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0;
      }
      /deep/ .vue-codemirror {
        height: 100% !important;
      }
      /deep/ .CodeMirror {
        height: 100% !important;
        .CodeMirror-vscrollbar {
          width: 0;
        }
        .CodeMirror-hscrollbar {
          height: 0;
        }
      }
    }
  }
  .main-right {
    flex: 1;
    height: 100%;
    border-left: 1px solid rgb(65, 65, 65);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
    ul {
      &::-webkit-scrollbar {
        height: 0;
      }
      .selected {
        background-color: var(--color-bg-primary);
        border-bottom: 1px solid var(--color-selected);
        border-top: 1px solid var(--color-selected);
      }
    }
    ul li {
      min-width: 200px;
      display: flex;
      flex-direction: row;
      margin-bottom: 5px;
      // border-bottom: 1px solid rgb(65, 65, 65);
      .title {
        flex: 1;
      }
      .number {
        width: 30px;
        text-align: center;
        color: var(--color-selected);
      }
      .operation {
        width: 110px;
      }
    }
  }
}

#pager main ul {
  width: 100%;
  height: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
}
#pager main .tips-msg {
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
}
#pager main ul li {
  padding: 0 10px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  box-sizing: border-box;
  border: 1px solid var(--color-bg);
  list-style-type: none;
  display: flex;
  flex-direction: row;
  font-size: 18px;
}
#pager main ul li:hover {
  border-bottom: 1px solid var(--color-selected);
  border-top: 1px solid var(--color-selected);
  cursor: pointer;
}

#pager main ul li .title {
  min-width: 50px;
  height: 100%;
  overflow: hidden;
}

#pager main ul li .type {
  width: 80px;
  height: 100%;
  padding-right: 3px;
  padding-left: 3px;
}
#pager main ul li .type span {
  border-color: var(--color-selected);
  background-color: var(--color-selected);
  color: var(--color-bg);
  padding: 3px;
  border-radius: 3px;
}

// #pager main ul li .title:hover {
//   text-decoration: underline;
//   color: var(--color-selected);
// }

#pager main ul li .description {
  flex: 1;
  height: auto;
  display: flex;
  overflow: hidden;
  font-style: italic;
}
#pager main ul li .date {
  width: 200px;
  height: auto;
  display: flex;
  overflow: hidden;
  justify-content: center;
}

#pager header .search-area {
  flex: 1;
  display: flex;
  height: 100%;
  align-items: center;
  padding-left: 20px;
}

#pager header .search-area select {
  width: 120px;
}
#pager header .search-area input {
  margin-left: 10px;
}
.create-text {
  text-decoration: underline;
  font-weight: bolder;
}
.create-text:hover {
  color: var(--color-selected);
  cursor: pointer;
}

.font-selector {
  display: flex;
  width: auto;
  height: 32px;
  justify-content: center;
  align-items: center;
  padding: 0px 3px;
  margin-right: 5px;
  > span {
    width: 61px;
    margin-right: 3px;
  }
}

.font-selector select {
  outline: none;
  border: none;
  height: 25px;
  width: auto;
  line-height: 25px;
}

.sort-selector {
  display: flex;
  width: auto;
  height: 32px;
  justify-content: center;
  align-items: center;
  padding: 0px 3px;
  margin-right: 5px;
}
.sort-selector select {
  outline: none;
  border: none;
  height: 25px;
  width: auto;
  line-height: 25px;
}

/* loading */
.pswp__preloader__icn {
  opacity: 0.75;
  width: 24px;
  height: 24px;
  -webkit-animation: clockwise 500ms linear infinite;
  animation: clockwise 500ms linear infinite;
}

/* The idea of animating inner circle is based on Polymer loading indicator by Keanu Lee https://blog.keanulee.com/2014/10/20/the-tale-of-three-spinners.html */
.pswp__preloader__cut {
  position: relative;
  width: 12px;
  height: 24px;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.pswp__preloader__donut {
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-text);
  border-radius: 50%;
  border-left-color: transparent;
  border-bottom-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  margin: 0;
  -webkit-animation: donut-rotate 1000ms cubic-bezier(0.4, 0, 0.22, 1) infinite;
  animation: donut-rotate 1000ms cubic-bezier(0.4, 0, 0.22, 1) infinite;
}

@-webkit-keyframes clockwise {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes clockwise {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes donut-rotate {
  0% {
    -webkit-transform: rotate(0);
  }
  50% {
    -webkit-transform: rotate(-140deg);
  }
  100% {
    -webkit-transform: rotate(0);
  }
}
@keyframes donut-rotate {
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(-140deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>
