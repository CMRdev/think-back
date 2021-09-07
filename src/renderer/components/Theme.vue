<template>
  <div class='theme-operation'>
    <div class='btn-group'>
      <div class='btn' :class="{'btn-active': currentTheme === 1}" @click="themeSelector(1)">Light</div>
      <div class='btn' :class="{'btn-active': currentTheme === 0}" @click="themeSelector(0)">Dark</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ThemeSelector',
  data () {
    return {
      currentTheme: 1
    }
  },
  methods: {
    themeSelector (themeKey) {
      this.currentTheme = themeKey
      // The `__static` is a gloabl variable from electron.
      let staticPath = __static
      // For the local dev environment. Just use the absolute path : '/static'
      if (process.env.NODE_ENV !== 'production') {
        staticPath = '/static'
      }
      // Change the global color variable style href.
      const link = document.querySelector('link[name="theme"]')
      if (this.currentTheme === 0) {
        link.href = `${staticPath}/black.css`
      } else {
        link.href = `${staticPath}/light.css`
      }
      // Sink to localStorage.
      window.localStorage.setItem('CURRENT_THEME', this.currentTheme)
      // Notification partent compoent! ' The theme has been changed.
      this.$emit('themeChange', {})
    }
  },
  created () {
    // default theme was 0 => meaing 'black'
    this.currentTheme = Number(window.localStorage.getItem('CURRENT_THEME')) | 0
    this.themeSelector(this.currentTheme)
  }
}
</script>
<style>
  .theme-operation {
    width: auto;
    height: 24px;
    display: flex;
    align-items: center;
    margin-left: 20px;
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 12px;
  }
  .theme-operation .btn-group {
    width: auto;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid var(--color-text);
  }

  .theme-operation .btn-group .btn {
    width: auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 3px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .theme-operation .btn-group .btn-active {
    background: var(--color-selected);
    color: var(--color-bg);
    cursor: auto;
  }
</style>
