export default {
  //更新list，如果不存在则插入，如果存在则替换，items可以是一个数组
  update(list, items, idField='id') {
    let added = [], updated = []

    if (!Array.isArray(items)) {
      items = [items]
    }

    for(let i=0, _len=list.length; i<_len; i++) {
      if(items.length == 0) break
      let item = list[i]
      for(let j=0, _len_j=items.length; j<_len_j; j++){
        if (item[idField] == items[j][idField]) {
          let row = Object.assign({}, item, items[j])
          list.splice(i, 1, row)
          items.splice(j, 1)
          updated.push(row)
          break
        }
      }
    }

    for(let item of items) {
      list.push(item)
      added.push(item)
    }

    return {added, updated}
  },

  index(list, items, idField='id') {
    let r = this._index(list, items, idField)
    return r>=0? r:-1
  },

  get(list, items, idField='id') {
    return this._index(list, items, idField, false)
  },

  //查找对象的位置，item可以是数组
  //items可以是id值或数组，或对象
  //返回结果按照从小到大排列
  //index=true表示返回位置值，否则是对应的对象
  _index(list, items, idField='id', index=true) {
    let pos = {}, new_items = [], single = false

    if (!Array.isArray(items)) {
      items = [items]
      single = true
    }

    for(let i=0, _len=items.length; i<_len; i++) {
      let item = items[i]
      if (item instanceof Object)
        new_items.push({id:i, value:item})
      else
        new_items.push({id:i, value:{[idField]:item}})
    }

    if (new_items.length > 0) {
      for(let i=0, _len=list.length; i<_len; i++) {
        let itema = list[i]
        for(let j=0, _len_j=new_items.length; j<_len_j; j++) {
          let itemb = new_items[j]
          if (itema[idField] == itemb['value'][idField]) {
            if (index)
              pos[itemb['id']] = i
            else
              pos[itemb['id']] = list[i]
            new_items.splice(j, 1) //删除不再处理
            break
          }
        }
        if (new_items.length == 0)
          break
      }

    }

    if (pos.length === 0) return null
    if (single) return pos[0]
    else {
      let result = []
      for(let k in pos){
        result.push([k, pos[k]])
      }
      let r =[]
      for(let x of result.sort(i=>i[0])) {
        r.push(x[1])
      }
      return r //pos.values() 不能用 // ES2015会按照key为数值时，按大小来返回
    }
  },

  //在指定位置插入数据
  //position可以是位置的序号或对象，当为对象时，首先要查找指定的位置
  insert(list, position, items, idField='id') {
    if (position>=list.length) this.add(list, items, position=-1)
    else {
      if (!Array.isArray(items)) {
        items = [items]
      }

      for(let item of items.reverse()) {
        list.splice(position, 0, item)
      }
    }
  },

  //在指定位置或最后插入数据
  //position可以是位置的序号或对象，当为对象时，首先要查找指定的位置
  add(list, items, position=-1) {
    if (!Array.isArray(items)) {
      items = [items]
    }

    if (position==-1 || position >= (list.length - 1))
      position = -1
    else
      position = position + 1
    if (position == -1) {
      for(let item of items) {
        list.push(item)
      }
    } else {
      for(let item of items.reverse()) {
        list.splice(position, 0, item)
      }
    }
  },

  //删除位置元素或对象
  remove(list, items, idField='id') {
    let indexes
    let removed = []

    if (!Array.isArray(items))
      items = [items]

    indexes = this.index(list, items, idField).sort().reverse()
    for(let i of indexes) {
      removed.push(list[i])
      list.splice(i, 1)
    }

    return removed
  },

  //排序用的比较函数
  _by (name, desc, minor) {
    desc = desc || false;
    return function(o, p){
      let a, b

      if (o instanceof Object && p instanceof Object && o && p) {
        a = o[name]
        b = p[name]
        if (a === b) {
            return typeof minor === 'function' ? minor(o,p):0;
        }
        if (typeof a === typeof b) {
          if (desc)
            return a < b ? 1 : -1;
          else
            return a < b ? -1 : 1;
        }
        return 0
      }
      else {
        throw ("error");
      }
    }
  },

  mergesort (array, /* optional */ cmp) {
    /*
        Merge sort.
        On average, two orders of magnitude faster than Array.prototype.sort() for
        large arrays, with potentially many equal elements.
        Note that the default comparison function does not coerce its arguments to strings.
    */

    if (cmp === undefined) {
        // Note: This is not the same as the default behavior for Array.prototype.sort(),
        // which coerces elements to strings before comparing them.
        cmp = function (a, b) {
            return a < b ? -1 : a === b ? 0 : 1
        }
    }

    function merge (begin, begin_right, end) {
        // Create a copy of the left and right halves.
        let left_size = begin_right - begin, right_size = end - begin_right
        let left = array.slice(begin, begin_right), right = array.slice(begin_right, end)
        // Merge left and right halves back into original array.
        let i = begin, j = 0, k = 0
        while (j < left_size && k < right_size)
            if (cmp(left[j], right[k]) <= 0)
                array[i++] = left[j++]
            else
                array[i++] = right[k++]
        // At this point, at least one of the two halves is finished.
        // Copy any remaining elements from left array back to original array.
        while (j < left_size) array[i++] = left[j++]
        // Copy any remaining elements from right array back to original array.
        while (k < right_size) array[i++] = right[k++]
        return
    }

    function msort (begin, end) {
        let size = end - begin
        if (size <= 8) {
            // By experimentation, the sort is fastest when using native sort for
            // arrays with a maximum size somewhere between 4 and 16.
            // This decreases the depth of the recursion for an array size where
            // O(n^2) sorting algorithms are acceptable.
            let sub_array = array.slice(begin, end)
            sub_array.sort(cmp);
            // Copy the sorted array back to the original array.
            for (let i = 0; i < size; ++i)
                array[begin + i] = sub_array[i]
            return
        }

        let begin_right = begin + Math.floor(size/2)

        msort(begin, begin_right)
        msort(begin_right, end)
        merge(begin, begin_right, end)
    }

    msort(0, array.length)

    return array
  },

  //对数组进行排序
  // order 可以是字段名，如 'name'， 也可以是一个数组，如：['name', 'age']
  // 如果字段名前有 '-' 表示降序
  // order 也可以是一个函数
  sort (items, order) {
    if (typeof order == 'string' || Array.isArray(order)) {
      let arr
      let key
      let f, desc, last=null
      if (typeof order == 'string') arr = [order]
      else arr = order
      for(let i=arr.length-1; i>-1; i--){
          key = arr[i];
          if(key && key.charAt(0) === '-'){
              desc = true
              key = key.substr(1)
          }
          else
              desc = false
          if (last)
              f = this._by(key, desc, last)
          else
              f = this._by(key, desc)
          last = f
      }
      return this.mergesort(items, f)
    } else if (typeof order === 'function') {
      // order by sort function
      return this.mergesort(items, order)
    }
    else {
      throw new TypeError('Order must be a function or a string')
    }
  },

  //分组处理
  //field为分组的字段，也可以是一个函数
  // (item)=>{return 分组键值}
  // 返回结构为 [{label:'group_key', items: []}, ...]
  group (list, field, group_field_name='label', children_field_name='items') {
    let result = [], result_pos = {}, func
    if (typeof field == 'string')
      func = (x)=>x[field]
    else if (typeof field == 'function')
      func = field
    else
      throw new TypeError("field should be string or functon")

    for(let item of list) {
      let key = func(item)
      let items = result_pos[key]
      if (!items) {
        items = {}
        items[group_field_name] = key
        items[children_field_name] = []
        result.push(items)
        result_pos[key] = items
      }
      items[children_field_name].push(item)
    }
    return result
  }

}

/*
        console.log(this.users)
        let a = list
        console.log('1', a.index(this.users, {id:572160}))
        console.log('2', a.index(this.users, {id:577222}))
        console.log('3', a.update(this.users, {id:577222, nickname:'test'}))
        console.log('4', a.get(this.users, 577222))
        console.log('5', a.add(this.users, {id:99999, nickname:'99999'}))
        console.log('6', a.get(this.users, [99999, 577222]))
        console.log('7', a.remove(this.users, [99999]))
        console.log('8', a.get(this.users, 99999))
        console.log('9', a.insert(this.users, 1, {id:99999, nickname:'99999'}))
        console.log('9', a.add(this.users, [{id:8888, nickname:'8888'}, {id:8889, nickname:'8889'}], 1))
        console.log('10', a.update(this.users, [{id:572160, nickname:'111'}, {id:8889, nickname:'222'}]))
        console.log('11', a.remove(this.users, [{id:572160, nickname:'111'}, {id:8889, nickname:'222'}]))
        console.log(this.users)

*/
