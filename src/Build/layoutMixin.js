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
    boxOptions: {},
    value: Object,
    static: {
      type: Boolean,
      default: false
    }, //是否表态展示
    staticSuffix: {
      type: String,
      default: '_static'
    },
    buttons: {},
    labelWidth: {
      type: Number,
      default: 150
    },
    validateResult: {},
    labelDir: { //标签排列方向，水平 horizontal 垂直 vertical
      type: String,
      default: 'horizontal'
    }
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
          if (!f) throw Error(`Can't find field ${name} in fields, please check if the name is not correct between layout and fields`)
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
