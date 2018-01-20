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
    if (s.hasOwnProperty(name) && name[0] !== '_') {
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
  let r = []
  let d
  for(let item of (choices || [])) {
    if (Array.isArray(item)) {
      d = {value: item[0], label: item[1]}
    } else if (typeof item === 'object'){
      d = item
    } else {
      d = {value: item, label: item}
    }
    r.push(d)
  }
  return r
}
