import {findParent} from '../utils/utils'

export default {
  name: 'CellRender',
  functional: true,
  props: {
    value: {},
    row: Object,
    render: Function,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, ctx) => {
    let grid = findParent(ctx.parent, 'Grid')
    let param = {
      value: ctx.props.value,
      column: ctx.props.column,
      row: ctx.props.row,
      grid: grid
    }
    return ctx.props.render(h, param)
  }
}
