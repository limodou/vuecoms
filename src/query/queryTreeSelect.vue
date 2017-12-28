<template>
  <treeselect v-if="isLoadRootOptions"
              v-model="val"
              :multiple="isMultiple"
              :loadChildrenOptions="loadingChildrenOptions"
              :load-root-options="loadRootOptions"
              :loadingText="loading"
  />
  <treeselect v-else
              v-model="val"
              :multiple="isMultiple"
              :options="option"
              :loadChildrenOptions="loadingChildrenOptions"
              :loadingText="loading"
  />
</template>
<script>
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.min.css'
  export default {
    data: function () {
      let val, option, isMultiple, isLoadRootOptions, loading;
      isMultiple = this.store.getField(this.tagName)['multiple'] ? this.store.getField(this.tagName)['multiple'] : false;
      val = null;
      let storeval = this.store.getVal(this.tagName);
      if (storeval && isMultiple) {
        val = Array.isArray(storeval) ? storeval : [storeval];
      } else if (storeval && !isMultiple) {
        val = (typeof storeval == "string") ? storeval : storeval.toString();
      }
      option = this.store.getField(this.tagName)['choices'] ? this.store.getField(this.tagName)['choices'] : [];

      isLoadRootOptions = this.store.getField(this.tagName)['loadRoot'] ? true : false;
      loading = this.store.getField(this.tagName)['loading']?this.store.getField(this.tagName)['loading']:"加载中..."
      return {
        val, option, isMultiple, isLoadRootOptions, loading
      }
    },
    mounted:function () {},
    methods: {
      loadingChildrenOptions: function (parent, callback) {
        this.store.getField(this.tagName)['loadChildren'](parent, callback);
      },
      loadRootOptions: function (callback) {
        this.store.getField(this.tagName)['loadRoot'](callback);
      }
    },
    watch: {
      val: function (v) {
        this.store.setVal(this.tagName, v);
      },
      "store.states.value": {
        handler: function (o, v) {
          if (o[this.tagName] != this.val) {
            this.val = o[this.tagName]
          }
        },
        deep: true
      }
    },
    components: {
      Treeselect
    },
    props: ["store", "tagName"]
  }
</script>
