<template>
  <div class="u-build">
    <template v-for="item in data">
      <component
        v-if="!item.hidden"
        :is="item.component || 'BuildLayout'"
        v-bind="item"
        :value="value"
        :labelWidth="item.labelWidth || labelWidth"
        :staticSuffix="staticSuffix"
        :validateResult="validateResult"
        :ref="item.name"
        ></component>
    </template>
  </div>
</template>

<script>
import {validateRule} from './validateUtil'
import {deepCompare, deepCopy, isEmpty} from '../utils/utils'

export default {
  name: 'Build',
  data () {
    return {
      oldvalue: deepCopy(this.value),
      fields: {},
      rows: {}, // 每段索引,key为每段name值，如果没有则不插入
      validating: false,
      validateResult: {} //保存校验结果
    }
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },

    labelWidth: {
      type: Number,
      default: 150
    },

    plainData: true, //数据是否扁平化
    staticSuffix: {
      type: String,
      default: '_static'
    },

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
    },

    // 用于选择控件设置choices
    choices: {
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
          // 增加对hidden的处理
          if (r.rule && r.rule.length > 0 && !this.fields[k].hidden) {
            if (!r.validateState && !this.fields[k].static) {
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
          this.validating = false
          this.$emit('validating', false)
          callback()
        }
      }

      _check_pending(this.validateResult, true)
    },

    //生成校验结构
    makeValidateResult () {
      for(let name in this.fields) {
        let field = this.fields[name]
        if (!this.validateResult[name] && !field.static) {
          let rule = this.getRule(field)
          this.$set(this.validateResult, name, {error: '', validateState: '', rule: rule})
        }
      }
    },

    makeFields () {
      var fs = {}
      for(let row of this.data) {
        if (row.name) {
          this.rows[row.name] = row
        }
        for(let field of (row.fields || [])) {
          fs[field.name] = field
          this.$set(field, 'static', field.static || false)
          this.$set(field, 'hidden', field.hidden || false)
          this.$set(field, 'enableOnChange', false) // 禁止Input确发onChange回调
          if (typeof field.options === 'undefined') {
            this.$set(field, 'options', {})
          }
          if (field.options.hasOwnProperty('choices'))
            this.$set(field.options, 'choices', field.options.choices)
          if (!field.type)
            this.$set(field, 'type', 'str') //str
        }
      }
      this.fields = fs
    },

    getRule (field) {
      let rule

      if (!field.rule || field.static) {
        rule = []
      } else {
        if (!Array.isArray(field.rule)) {
          field.rule.fullField = field.label
          rule = [field.rule]
        } else {
          rule = field.rule.slice()
          for(var r of rule) {
            if (r instanceof Object) {
              r.fullField = field.label
            }
          }
        }
      }

      // 添加必填校验
      if (field.required) {
        if (field.type !== 'checkbox') {
          // 如果有上一个校验规则，则将required合并到其中，否则插入新的规则
          if (rule.length > 0) {
            rule[0].required = true
          } else {
            rule.splice(0, 0, {required:true, fullField: field.label, type: field.multiple ? 'array' : 'string'})
          }
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
    this.makeFields()
    this.makeValidateResult()
    this.mergeRules()
    this.mergeErrors()
  },

  watch: {
    value: {
      handler (newvalue) {
        let v = deepCompare(newvalue, this.oldvalue, true)
        if (!isEmpty(v)) {
          this.oldvalue = deepCopy(newvalue)
          for (let k in v) {
            let field = this.fields[k]
            if (field && field.onChange) {
              field.onChange(v[k].value, newvalue)
            }
          }
        }
      },
      deep: true
    },
    errors: {
      handler () {
        this.mergeErrors()
      },
      deep: true
    },

    choices: {
      immediate: true,
      handler () {
        for(let row of this.data) {
          for(let field of (row.fields || [])) {
            let choices = this.choices[field.name]
            if (choices) {
              if (!field.options) {
                this.$set(field, 'options', {choices: choices})
              } else {
                this.$set(field.options, 'choices', choices)
              }
            }
          }
        }
      },
      deep: true
    },

    data: {
      handler () {
        this.makeFields()
        this.makeValidateResult()
        this.mergeRules()
      },
      deep: true
    }
    // rules: {
    //   handler () {
    //     this.mergeRules()
    //   },
    //   deep: true
    // }
  }
}
</script>
