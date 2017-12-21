import List from '@/utils/list.js'

export default {
  props: {
    name: String,
    title: {
      type: String,
      default: ''
    },
    tools: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    },
    layout: {
      type: Array,
      default: () => []
    },
    boxComponent: {
      type: String,
      default: 'Box'
    },
    value: Object,
    static: {
      type: Boolean,
      default: false
    }, //是否表态展示
    buttons: {},
    labelWidth: {
      type: Number,
      default: 120
    },
    validateResult: {}
  },

  computed: {
    rows () {
      let r = [], name
      for (let row of this.layout) {
        let new_r = []
        r.push(new_r)
        let span = 24 / row.length

        //重新计算col
        for (let col of row) {
          if (typeof col === 'object') {
            name = col.name
            span = col.colspan || span
          } else {
            name = col
          }
          let width = 100 / 24 * span
          let f = List.get(this.fields, name, 'name')
          let field = Object.assign({colspan: span,
            labelWidth: this.labelWidth,
            static: col.static || this.static,
          }, f)

          new_r.push(field)
        }
      }
      return r
    },

    btns () {
      if (Array.isArray(this.buttons)) return this.buttons
      else return this.buttons.items
    },

    size () {
      return this.buttons.size || 'default'
    }
  }
}