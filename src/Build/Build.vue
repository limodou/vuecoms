<template>
  <div class="u-build">
    <component v-for="item in data"
      :is="item.layoutComponent || 'Layout'"
      v-bind="item"
      :value="value"></component>
  </div>
</template>

<script>
export default {
  name: 'Build',
  data () {
    return {
      validating: false,
      error: '',
      validateCount: 0
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },

    plainData: true, //数据是否扁平化

    value: { // 数据存放对象
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  methods: {
    validate (callback) {
      this.validating = true

      const _check = (children, result, recursion) => {
        let error = ''
        for(let c of children) {
          if (c.validate && c.col.rule && c.col.rule.length > 0 && !c.col.static) {
            if (!c.validateState) {
              c.validate()
              result.pending.push(c)
            } else if (c.validateState === 'validating') {
              result.pending.push(c)
            } else if (c.validateState === 'error' && !result.error) {
              result.error = c.error
            }
          }
          if (recursion && c.$children && c.$children.length > 0) {
            _check(c.$children, result, recursion)
          }
        }
      }

      const _check_pending = (children, recursion) => {
        let r = {error: '', pending: []}
        _check(children, r, recursion)
        if (r.error) {
          this.validating = false
          callback(r.error)
          return
        } else if (r.pending.length > 0) {
          setTimeout(()=>{
            _check_pending(r.pending, false)
          }, 10)
        } else {
          callback()
        }
      }

      _check_pending(this.$children, true)
      // _check(this.$children, result, true)
      // if (result.error) {
      //   this.validating = false
      //   callback(result.error)
      // } else if (result.pending.length > 0){
      //   _check_pending(result.pending)
      // } else {
      //   callback()
      // }
    }
  }
}
</script>
