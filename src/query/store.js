function Store(){
	
	this.state = {}

	// for(let name in options){
	// 	if(options.hasOwnProperty(name) && this.state.hasOwnProperty(name)){
	// 		this.state[name] = options[name]
	// 	}
	// }

	// if(!query){
	// 	throw new Error("Query is not required!");
	// }

}

Store.prototype.mutations = {
	setStateValue:function(obj){
		this.state[obj['key']] = obj['value'];
	},
	getStateValue:function(key){
		return this.state[key];
		// let result = {};
		// if(Array.isArray(names)){
		// 	for(let i=0,len=names.length;i<len;i++){
		// 		if(this.states.value.hasOwnProperty(names[i])){
		// 			result[names[i]] = this.states.value[names[i]];
		// 		}else{
		// 			result[names[i]] = null;
		// 		}
		// 	}
		// }else if(typeof names == "string"){
		// 	if(this.states.value.hasOwnProperty(names)){
		// 		result = this.states.value[names];
		// 	}else{
		// 		result = null;
		// 	}
		// }else{
		// 	result = this.states.value;
		// }
		// return result;
	},
	clearAllState:function(){
		let propertys = Object.keys(this.state);
		for(let i=0,len=propertys.length;i<len;i++){
			this.state[propertys[i]] = null;
		}
	}
}

Store.prototype.commit = function(action, ...args){
	if(this.mutations[action]){
		let re = this.mutations[action].apply(this,[].concat(args));
		return re;
	}else{
		throw new Error("Action name \""+name+"\" not found in Store");
	}
}

export default Store

// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

// export const store = new Vuex.Store({
//     state: {
//         //放置公用状态
    
//     },
//     getters: {
//         changeState: state => {
//             //相当于vue实例中的methods,用于处理公用data
//             //自vuex 面向组件的数据处理
//         }
//     },
//     mutations: {
//         //写法与getters相类似
//         //组件想要对于vuex 中的数据进行的处理
//         //组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
//         //内部操作必须在此刻完成(同步)
//         setStateValue(state,obj){
//         	state[obj['key']] = obj['value'];
//         },
//         getStateValue(state,k){
//         	return state[k]
//         },
//         clearAllState(state){
//         	for(let k in state){
//         		state[k] = null;
//         	}
//         },
//     },
//     actions: {
//         //使得mutations能够实现异步调用，实现例如延迟调用
//     },
//     modules: {
//         //引入某一个state的以上集合的模块，会自动分别填充到上面，使得结构更加清晰
//     }
// });