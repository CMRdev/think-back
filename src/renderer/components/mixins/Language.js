export default {
  name: 'LanguageSupport',
  methods: {
    languageLabel (val) {
      for (let index in this.languages) {
        let language = this.languages[index]
        if (language.value === val) {
          return language.label
        }
      }
      return 'code'
    }
  },
  data () {
    return {
      languages: [{
        label: 'JavaScript',
        value: 'text/javascript'
      }, {
        label: 'TypeScript',
        value: 'text/javascript'
      }, {
        label: 'Sql',
        value: 'text/x-sql'
      }, {
        label: 'Java',
        value: 'text/x-java'
      }, {
        label: 'Python',
        value: 'python'
      }, {
        label: 'CSS',
        value: 'text/css'
      }, {
        label: 'SCSS',
        value: 'text/x-scss'
      }, {
        label: 'LESS',
        value: 'text/x-less'
      }, {
        label: 'Html',
        value: 'text/html'
      }, {
        label: 'Xml',
        value: 'application/xml'
      }, {
        label: 'Yaml',
        value: 'text/x-yaml'
      }, {
        label: 'Properties',
        value: 'text/x-properties'
      }, {
        label: 'Shell',
        value: 'text/x-sh'
      }, {
        label: 'Dart',
        value: 'dart'
      }, {
        label: 'Vue',
        value: 'text/x-vue'
      }, {
        label: 'Go',
        value: 'text/x-go'
      }, {
        label: 'Groovy',
        value: 'text/x-groovy'
      }, {
        label: 'C',
        value: 'text/x-csrc'
      }, {
        label: 'C++',
        value: 'text/x-c++src'
      }]
    }
  }
}
