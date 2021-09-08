<template>
  <div id="pager">
    <header>
      <theme-selector @themeChange='themeChange'></theme-selector>
      <div class='operation'>
        <div class='operation-btn' @click="save">Save</div>
        <div class='operation-btn' @click="cancel">Cancel</div>
      </div>
    </header>
    <main>
      <div class='editor-attr'>
        <div class='row'>
          <div class='title'>title:</div>
          <div class='input'>
            <input v-model="think.title" />
          </div>
        </div>
        <div class='row'>
          <div class='title'>type:</div>
          <div class='input'>
            <select v-model="think.type" @change="typeChange">
              <template v-for="(language, index) in getLans()">
                <option :key="index" :value="language.value">{{language.label}}</option>
              </template>
            </select>
          </div>
        </div>
        <div class='row'>
          <div class='title'>description:</div>
          <div class='input'>
            <input v-model="think.description" />
          </div>
        </div>
      </div>
      <div class='editor-container' id='editorArea'>
        <codemirror ref="myCm" :value="think.content" :options="cmOptions" @ready="onCmReady" @focus="onCmFocus"
          @input="onCmCodeChange">
        </codemirror>
      </div>
    </main>
  </div>
</template>
<script>
import ThemeSelector from './Theme'
import LanguageSupport from './mixins/Language'
import Stable from './mixins/Stable'
export default {
  name: 'editor-page',
  mixins: [LanguageSupport, Stable],
  components: { ThemeSelector },
  data () {
    return {
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
        height: '100%'
      },
      think: {
        title: '',
        description: '',
        content: '',
        date: 0,
        type: null
      },
      thinkId: null,
      codemirror: null
    }
  },
  methods: {
    onCmReady () {
      this.codemirror && this.codemirror.setOption('theme', this.cmOptions.theme)
      this.codemirror && this.codemirror.refresh()
    },
    themeChange () {
      this.refreshTheme()
      this.onCmReady()
    },
    onCmFocus () { },
    onCmCodeChange (value) {
      this.$set(this.think, 'content', value)
    },
    typeChange () {
      this.codemirror && this.codemirror.setOption('mode', this.think.type)
      this.codemirror && this.codemirror.refresh()
    },
    goToEditor () {
      this.$router.push('/')
    },
    save () {
      // simple form check.
      if (!this.think.title) {
        alert('The think title can not be empty!')
        return
      } else if (this.think.title.length > 120) {
        alert('The think title is too long!')
        return
      }
      if (!this.think.content) {
        alert('The think content can not be empty!')
        return
      }
      if (!this.think.type) {
        alert('Must select a language type!')
        return
      }
      if (this.think.description && this.think.description.length > 500) {
        alert('the description is too long!')
        return
      }
      this.think.date = (new Date()).getTime()
      if (this.thinkId) {
        this.$thinkbackDB.think.update(this.thinkId, Object.assign({}, this.think, { id: this.thinkId }))
      } else {
        this.$thinkbackDB.think.add(this.think)
      }
      this.update(this.think.type)
      this.goToEditor()
    },
    cancel () {
      this.goToEditor()
    },
    refreshTheme () {
      const currentTheme = Number(window.localStorage.getItem('CURRENT_THEME'))
      if (currentTheme === 0) {
        this.cmOptions.theme = 'base16-dark'
      } else {
        this.cmOptions.theme = 'base16-light'
      }
    }
  },
  mounted () {
    let id = this.$route.params.id
    this.codemirror = this.$refs.myCm && this.$refs.myCm.codemirror
    if (id) {
      this.$thinkbackDB.think.get({ id: Number(id) }).then(record => {
        this.thinkId = record.id
        this.think.title = record.title
        this.think.content = record.content
        this.think.type = record.type
        this.think.description = record.description
        this.codemirror.setValue(this.think.content)
        this.typeChange()
      })
    }
  },
  created () {
    this.refreshTheme()
  }
}
</script>
<style lang="scss" scoped>
.editor-attr {
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  box-sizing: border-box;
}

.editor-attr .row {
  width: 100%;
  height: 40px;
  justify-content: start;
  align-content: center;
  flex-direction: row;
  justify-content: start;
  align-items: center;
}

.editor-attr .row .input {
  float: left;
  width: calc(100% - 200px);
  line-height: 38px;
}
.editor-attr .row .title {
  width: 200px;
  height: 100%;
  float: left;
  line-height: 40px;
}

.editor-container {
  flex: 1;
  width: 100%;
  height: calc(100% - 120px);
  overflow-y: auto;
  padding-bottom: 20px;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0;
  }
}

.vue-codemirror {
  height: 100%;
  /deep/ .CodeMirror {
    height: 100% !important;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
      Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji,
      Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji !important;
    .CodeMirror-vscrollbar {
      width: 0;
    }
  }
}

.CodeMirror-scroll {
  height: auto !important;
  overflow-y: hidden !important;
  overflow-x: auto !important;
}
</style>
