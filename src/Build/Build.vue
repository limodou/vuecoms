<template>
  <div class="u-build">
    <component v-for="item in data"
      :is="item.component || 'Layout'"
      v-bind="item"
      :value="value"
      :validateResult="validateResult"
      ></component>
  </div>
</template>

<script>
import {validateRule} from './validateUtil'

export default {
  name: 'Build',
  data () {
    return {
      validating: false,
      validateResult: {} //保存校验结果
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
    },

    //用于后台校验返回的信息，形式为
    //{name: '错误描述'}
    errors: {
      type: Object,
      default () {
        return {}
      }
    },

    rules: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  methods: {
    validate (callback) {
      if (this.validating) return
      this.validating = true
      this.$emit('validating', true)

      const _check = (children, result, recursion) => {
        let error = ''
        for(let k in this.validateResult) {
          let r = this.validateResult[k]
          if (r.rule && r.rule.length > 0) {
            if (!r.validateState) {
              validateRule(this.value, k, this.validateResult)
              result.pending.push(r)
            } else if (r.validateState === 'validating') {
              result.pending.push(r)
            } else if (r.validateState === 'error' && !result.error) {
              result.error = r.error
            }
          }
        }
      }

      const _check_pending = (children, recursion) => {
        let r = {error: '', pending: []}
        _check(children, r, recursion)
        if (r.error) {
          this.validating = false
          this.$emit('validating', false)
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

      _check_pending(this.validateResult, true)
    },

    //生成校验结构
    makeValidateResult () {
      for(let b of this.data) {
        for(let field of (b.fields || [])) {
          if (!this.validateResult[field.name]) {
            let rule = this.getRule(field)
            this.$set(this.validateResult, field.name, {error: '', validateState: '', rule: rule})
          }
        }
      }
    },

    getRule (field) {
      let rule

      if (!field.rule || field.static) {
        rule = []
      } else {
        if (!Array.isArray(field.rule)) {
          rule = [field.rule]
        } else {
          rule = field.rule.slice()
        }
      }

      // 添加必填校验
      if (field.required) {
        if (field.type !== 'checkbox') {
          rule.splice(0, 0, {required:true})
        } else {
          field.required = false
        }
      }
      return rule
    },

    mergeErrors (errors) {
      for(let k in this.errors) {
        this.$set(this.validateResult[k], 'error', this.errors[k])
        this.$set(this.validateResult[k], 'validateState', 'error')
      }
    },

    // 合并rules
    mergeRules () {
      for(let k in this.rules) {
        let result = this.validateResult[k]
        let v = this.rules[k]
        if (!result) continue
        if (Array.isArray(v)) {
          result.rule = result.rule.concat(v)
        } else {
          result.rule.push(v)
        }
      }
    }
  },

  created () {
    this.makeValidateResult()
    this.mergeRules()
    this.mergeErrors()
  },

  watch: {
    // data: {
    //   handler () {
    //     this.makeValidateResult()
    //     this.mergeRules()
    //   },
    //   deep: true
    // },
    errors: {
      handler () {
        this.mergeErrors()
      },
      deep: true
    },
    // rules: {
    //   handler () {
    //     this.mergeRules()
    //   },
    //   deep: true
    // }
  }
}
</script>
