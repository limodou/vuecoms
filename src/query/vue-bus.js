(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.VueBus = factory());
}(this, (function() { 

      function VueBus(Vue) {

        var bus = new Vue();

        bus.state = {}

        Object.defineProperty(Vue.prototype, '$bus', {
          get: function() {
            return bus;
          }
        });
      }

      if (typeof window !== 'undefined' && window.Vue) {
        window.Vue.use(VueBus);
      }

      return VueBus;
    })
  )
);