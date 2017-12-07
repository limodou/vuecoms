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
    r[name] = function mappedState() {
      return this.store.states[name]
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
    if (o.hasOwnProperty(name) && name[0] !== '_') {
      s[name] = o[name]
    }
  }
}

export const isDate = function (str)
{
  let r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
  if (r == null) return false
  let d = new Date(r[1], r[3]-1, r[4])
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4])
}

export const isDateTime = function (str)
{
  let reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/
  let r = str.match(reg)
  if(r == null)return false
  var d = new Date(r[1], r[3]-1, r[4], r[5], r[6], r[7])
  return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] &&
    d.getDate() == r[4] && d.getHours() == r[5] &&
    d.getMinutes() == r[6] && d.getSeconds() == r[7])
}
