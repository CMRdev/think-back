export default {
  name: 'Stable-mixins',
  methods: {
    getOrder () {
      let orderObj = localStorage.getItem(this.KEY)
      if (orderObj !== null && orderObj.length > 0) {
        return JSON.parse(orderObj)
      } else {
        let order = {}
        for (let i = 0; i < this.lans.length; i++) {
          order[this.lans[i].value] = 0
        }
        return order
      }
    },
    update (value) {
      let order = this.getOrder()
      order[value] = order[value] + 1
      localStorage.setItem(this.KEY, JSON.stringify(order))
    },
    getLans () {
      let lansInOrder = []
      let order = this.getOrder()
      for (let i = 0; i < this.lans.length; i++) {
        let lan = JSON.parse(JSON.stringify(this.lans[i]))
        lan.order = order[lan.value]
        lansInOrder.push(lan)
      }
      lansInOrder.sort(function (a, b) {
        return b.order - a.order
      })
      return lansInOrder
    }
  },
  data () {
    return {
      KEY: 'LANGUAGE_ORDER_STORE',
      lans: [{
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
