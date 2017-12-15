export default {
  'default': '字段 %s 校验失败',
  required: '%s 必填',
  'enum': '%s 必需是 %s 其中之一',
  whitespace: '%s 不能为空',
  date: {
    format: '%s 日期 %s 对于格式 %s 无效',
    parse: '%s 日期不能被解析, %s 无效 ',
    invalid: '%s 日期 %s 无效'
  },
  types: {
    string: '%s 不是一个 %s',
    method: '%s 不是一个 %s (函数)',
    array: '%s 不是一个 %s',
    object: '%s 不是一个 %s',
    number: '%s 不是一个 %s',
    date: '%s 不是一个 %s',
    boolean: '%s 不是一个 %s',
    integer: '%s 不是一个 %s',
    float: '%s 不是一个 %s',
    regexp: '%s 不是一个有效的 %s',
    email: '%s 不是一个有效的 %s',
    url: '%s 不是一个有效的 %s',
    hex: '%s 不是一个有效的 %s'
  },
  string: {
    len: '%s 需要长度为 %s 个字符',
    min: '%s 需要至少 %s 个字符',
    max: '%s 不能超过 %s 个字符',
    range: '%s 必须在 %s 和 %s 个字符之间'
  },
  number: {
    len: '%s 必须等于 %s',
    min: '%s 不能小于 %s',
    max: '%s 不能大于 %s',
    range: '%s 必须在 %s 和 %s 之间'
  },
  array: {
    len: '%s 长度必须为 %s',
    min: '%s 长度不能小于 %s',
    max: '%s 长度不能大于 %s',
    range: '%s 长度必须在 %s 和 %s 之间'
  },
  pattern: {
    mismatch: '%s 值 %s 与模式 %s 不匹配'
  }
}
