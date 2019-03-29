const scrollbarMeasure = {
  position: 'absolute',
  top: '-9999px',
  width: '50px',
  height: '50px',
  overflow: 'scroll'
}

let scrollbarWidth

export const measureScrollbar = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return 0 // 如果 document 不在，则证明不在浏览器环境，直接返回，兼容 node server render。
  }
  if (scrollbarWidth) {
    return scrollbarWidth // 滚动条在固定的环境下宽度不会改变，因此只做一次探测即可，优化性能。
  }
  const scrollDiv = document.createElement('div')
  Object.keys(scrollbarMeasure).forEach((scrollProp) => {
    if (Object.prototype.hasOwnProperty.call(scrollbarMeasure, scrollProp)) {
      scrollDiv.style[scrollProp] = scrollbarMeasure[scrollProp]
    }
  }) // 创造一个远离人世的带滚动条的 div 用于探测，用户对于此无感知。
  document.body.appendChild(scrollDiv)
  const width = scrollDiv.offsetWidth - scrollDiv.clientWidth // 获取滚动条的宽度，offsetWidth 和 clientWidth 的区别，你能说清楚吗？
  document.body.removeChild(scrollDiv) // 探测完成，销毁测试元素，减少对页面的影响。
  scrollbarWidth = width // 缓存结果，优化性能
  return scrollbarWidth
}

export const clickoutside = {
  bind (el, binding, vnode) {
    function documentHandler (e) {
      if (el.contains(e.target)) {
        return false
      }
      if (binding.expression) {
        binding.value(e)
      }
    }
    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
  },
  update () {

  },
  unbind (el, binding) {
    document.removeEventListener('click', el.__vueClickOutside__)
    delete el.__vueClickOutside__
  }
}

export const mapState = (...names) => {
  let r = {}
  for(let name of names) {
    r[name] = {
      get () {
        return this.store.states[name]
      },
      set (value) {
        this.store.grid.$set(this.store.states, name, value)
      }
    }
  }
  return r
}

export const mapMethod = (...names) => {
  let r = {}
  for(let name of names) {
    r[name] =  function mappedMethod(...args) {
      return this.store[name](...args)
    }
  }
  return r
}

export const getOffset = function (el) {
  let top = el.offsetTop
  let left = el.offsetLeft;
  let val = el.offsetParent
  while(val){
    top += val.offsetTop
    left += val.offsetLeft
    val = val.offsetParent
  }
  return {top, left}
}

export const copyDataRow = function (s, o) {
  for (let name in o) {
    if (name[0] !== '_') {
      s[name] = o[name]
    }
  }
}

export const isDate = function (str)
{
  if (!str) return false
  let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
  if (r == null) return false
  let d = new Date(r[1], r[3]-1, r[4])
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4])
}

export const isDateTime = function (str)
{
  if (!str) return false
  let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  let r = str.match(reg)
  if(r == null)return false
  var d = new Date(r[1], r[3]-1, r[4], r[5], r[6], r[7])
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] &&
    d.getDate() == r[4] && d.getHours() == r[5] &&
    d.getMinutes() == r[6] && d.getSeconds() == r[7])
}

export const text2html = function (text) {
  if (!text) return ''
  // 1: Plain Text Search
  text = text.replace(/&/g, "&amp;").
  replace(/</g, "&lt;").
  replace(/>/g, "&gt;").replace(/  /g, "&nbsp;&nbsp;")

  // 2: Line Breaks
  text = text.replace(/\r\n?|\n/g, "<br>")

  // 3: Paragraphs
  text = text.replace(/<br>\s*<br>/g, "</p><p>")

  // 4: Wrap in Paragraph Tags
  text = "<p>" + text + "</p>"

  return text
}

export let QueryURL = function(url) {
  this.urlParams = {}
  this.load(url)
}

QueryURL.prototype = {
  load: function (param) {
    this.urlParams = {}
    this.url = param;
    var e, k, v, i,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&=]+)=?([^&]*)/g,
      d = function (s) {
        return decodeURIComponent(s.replace(a, " "))
      }
    if (!param) {
      param = window.location.search
    }
    if (param.charAt(0) == '?') {
      param = param.substring(1)
      this.url = ''
    } else {
      i = param.indexOf('?')
      if (i > -1) {
        this.url = param.substring(0, i)
        param = param.substring(i + 1)
      } else
        param = ''
    }
    while (e = r.exec(param)) {
      k = d(e[1]);
      v = d(e[2]);
      this.set(k, v, false)
    }
    return this;
  },
  toString: function (options) {
    var settings = {
      'hash': false,
      'traditional': true
    };
    if (options) {
      $.extend(settings, options)
    }
    var old = jQuery.ajaxSettings.traditional
    jQuery.ajaxSettings.traditional = settings.traditional
    var result = '?' + $.param(this.urlParams)
    jQuery.ajaxSettings.traditional = old
    if (settings.hash)
      result = result + window.location.hash
    return result
  },
  merge: function (data) {
    for(var k in data) {
      if (k[0] == '-') //first char is '-' means this key will be removed
        this.remove(k.substr(1))
      else {
        this.set(k, data[k], true)
      }
    }
    return this
  },
  set: function (k, v, replace) {
    replace = replace || false;
    if (replace)
      this.urlParams[k] = v
    else {
      if (k in this.urlParams) {
        if (Array.isArray(this.urlParams[k])) {
          this.urlParams[k].push(v)
        }
        else {
          this.urlParams[k] = [this.urlParams[k], v]
        }
      }
      else
        this.urlParams[k] = v
    }
    return this;
  },
  get: function (k) {
    return this.urlParams[k]
  },
  remove: function (k) {
    if (k in this.urlParams) {
      delete this.urlParams[k]
    }
    return this
  }
}

export const uuid = function () {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0
    d = Math.floor(d/16)
    return (c=='x' ? r : (r&0x3|0x8)).toString(16)
  })
  return uuid
}

// 格式化choices, 转对对象形式
export const formatChoices = function (choices) {
  let d
  if (!choices || isEmpty(choices)) return []
  if (!Array.isArray(choices)) choices = [choices]
  let r = []
  for(let item of choices) {
    if (Array.isArray(item)) {
      d = {value: item[0], label: item[1]}
    } else if ((item instanceof Object) && item.hasOwnProperty('label') && item.hasOwnProperty('value')){
      d = item
    } else {
      continue
    }
    r.push(d)
  }  
  return r
}

// 从choices中找到与value匹配的值， 返回为数组，每项值为 {value: xxx, label: xxx}
export const findChoices = function (choices, value) {
  let v = []
  let v1 = value
  choices = formatChoices(choices)
  if (!Array.isArray(value)) v1 = [value]
  for(let x of v1) {
    for(let c of choices) {
      if ((x instanceof Object  && x.value === c.value) || (x === c.value)) {
        v.push(c)
        break
      }
    }
  }
  return v
}

export const formatDate = function (d, fmt='yyyy/MM/dd') {
  if (!d) return ''
  if (typeof d === 'string') {
    d = new Date(d)
  }
  let year = d.getFullYear() + ''
  let mon = d.getMonth() + 1 < 10 ? `0${d.getMonth()+1}` : `${d.getMonth()+1}`
  let day = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`
  let hour = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`
  let minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`
  let second = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`
  return fmt.replace('yyyy', year).replace('MM', mon).replace('dd', day)
    .replace('hh', hour).replace('mm', minute).replace('ss', second)
}

// deepCopy
export const deepCopy = function (data) {
  let o

  if (Array.isArray(data)) {
      o = []
  } else if (data instanceof Object) {
      o = {}
  } else {
      return data
  }

  if (Array.isArray(data)) {
      for (let c of data) {
          o.push(deepCopy(c))
      }
  } else if (data instanceof Object) {
      for (let i in data) {
          o[i] = deepCopy(data[i])
      }
  }
  return o
}

// isEmpty
export const isEmpty = function (v) {
  if (Array.isArray(v)) {
    return v.length === 0
  } else if (v instanceof Object) {
    for (let c in v) {
      return false
    }
    return true
  }
  return !v
}

// merge 合并多个对象
export const merge = function (object, ...source) {
  for (let c of source) {
    for (let x in c) {
      object[x] = c[x]
    }
  }
  return object
}

// clear 清除对象属性
export const reset = function (x) {
  let c = x
  if (Array.isArray(x)) {
    c = []
  } else if (x instanceof Object) {
    c = {}
  } else if (typeof x === 'number') {
    c = 0
  } else if (typeof x === 'string') {
    c = ''
  } else if (typeof x === 'boolean') {
    c = false
  }
  return c
}

export const findParent = function (self, componentName) {
  let parent = self.$parent || self.$root
  let name = parent.$options.name
  if (!componentName) componentName = name

  while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
          name = parent.$options.name
      }
  }
  if (parent) {
      return parent
  }
}

function compare2Objects(x, y, leftChain, rightChain) {
  var p

  // remember that NaN === NaN returns false
  // and isNaN(undefined) returns true
  if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true
  }

  // Compare primitives and functions.     
  // Check if both arguments link to the same object.
  // Especially useful on the step where we compare prototypes
  if (x === y) {
      return true
  }

  // Works in case when functions are created in constructor.
  // Comparing dates is a common scenario. Another built-ins?
  // We can even handle functions passed across iframes
  if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString()
  }

  // At last checking prototypes as good as we can
  if (!(x instanceof Object && y instanceof Object)) {
      return false
  }

  if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false
  }

  if (x.constructor !== y.constructor) {
      return false
  }

  if (x.prototype !== y.prototype) {
      return false
  }

  // Check for infinitive linking loops
  if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false
  }

  // Quick checking of one object being a subset of another.
  // todo: cache the structure of arguments[0] for performance
  for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false
      } else if (typeof y[p] !== typeof x[p]) {
          return false
      }
  }

  for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false
      } else if (typeof y[p] !== typeof x[p]) {
          return false
      }

      switch (typeof(x[p])) {
          case 'object':
          case 'function':

              leftChain.push(x)
              rightChain.push(y)

              if (!compare2Objects(x[p], y[p], leftChain, rightChain)) {
                  return false
              }

              leftChain.pop()
              rightChain.pop()
              break

          default:
              if (x[p] !== y[p]) {
                  return false
              }
              break
      }
  }

  return true
}

// 比较两个对象，以obj1为准，比较与obj2不同的值
export const deepCompare = function (x, y, returnValue=false) {
  let i, l, leftChain, rightChain, result = {}

  leftChain = []
  rightChain = []

  if (returnValue) {
    for (let k in x) {
      if (!compare2Objects(x[k], y[k], leftChain, rightChain)) {
        result[k] = {value: x[k], old_value: y[k]}
      }
    }
    return result  
  } else {
    return compare2Objects(x, y, [], [])
  }
}

// 设置 select choice值
export const setChoice = function (vm, c, value) {
  if (!c.options) {
    vm.$set(c, 'options', {choices: value, type: 'select'})
  } else {
    vm.$set(c.options, 'choices', value)
  }
}


export const walkTree = (data, callback, childrenField='children') => {
  if (!data || data.length === 0) return
  const _f = (d) => {
    for(let c of d) {
      callback(c)
      if (c[childrenField] && c[childrenField].length > 0) {
        _f(c[childrenField])
      }
    }
  }

  return _f(data)
}