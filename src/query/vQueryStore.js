/**
 * Created by HoseaLee on 17/11/29.
 */
function Store(form, fields, value, choices) {
	this.form = form;

	let defaultStates = {
		fields: [],
		value: {},
		choices:{}
	};

	this.states = {
		fields: [],
		value: {},
		choices:{}
	}

	if (fields) this.states.fields = fields
	if (value) this.states.value = value
	if (choices) this.states.choices = choices

	for(var field of this.states.fields) {
		if (typeof this.states.value[field.name] === 'undefined') {
			if (field.multiple)
				this.states.value[field.name] = []
			else
				this.states.value[field.name] = ""
		}
	}
/*
	//put filed name to default's value
	for (let i = 0, len = fields.length; i < len; i++) {
		//defaultStates['value'][fields[i]['name']] = null;
		if (fields[i]['type'] && fields[i]['type'] == "iselect" && fields[i]['multiple']) {
			defaultStates['value'][fields[i]['name']] = []
		} else if (fields[i]['type'] && fields[i]['type'] == "checkbox") {
			defaultStates['value'][fields[i]['name']] = [];
		} else {
			defaultStates['value'][fields[i]['name']] = "";
		}

		if(fields[i]['type'] == 'iselect' || fields[i]['type'] == 'radio' || fields[i]['type'] == 'checkbox'){
			defaultStates['choices'][fields[i]['name']] = []
		}

	}
	//combin defaultState's value and parameter's value to defaultStates's value
	defaultStates['value'] = Object.assign(defaultStates['value'], value);


	//combin all parameters to states
	this.states = Object.assign(defaultStates, {fields: fields, choices:choices});
*/

	if (!form) {
		throw new Error('QueryForm object is Required!')
	}
}

Store.prototype.getDefaultValue = function (type) {

}

Store.prototype.setVal = function (key, val) {
	this.form.$set(this.states.value, key, val);
};

Store.prototype.getVal = function (key) {
	if (key) {
		return this.states.value[key];
	} else {
		let re = {};
		for (let k in this.states.value) {
			re[k] = this.states.value[k];
		}
		return re;
	}
};

Store.prototype.delVal = function (key) {
	if (key) {
		if (this.getField(key)['type'] && this.getField(key)['type'] == "iselect" && this.getField(key)['multiple']) {
			this.states.value[key] = []
		} else if (this.getField(key) && this.getField(key)['type'] == "checkbox") {
			this.states.value[key] = [];
		} else {
			this.states.value[key] = "";
		}
	} else {
		for (let k  in this.states.value) {
			if (this.getField(k) && this.getField(k)['type'] == "iselect" && this.getField(k)['multiple']) {
				this.states.value[k] = [];
			} else if (this.getField(k) && this.getField(k)['type'] == "checkbox") {
				this.states.value[k] = [];
			} else {
				this.states.value[k] = "";
			}
		}
	}
};

Store.prototype.getField = function (key) {
	if (key) {
		for (let i = 0, len = this.states.fields.length; i < len; i++) {
			if (this.states.fields[i]['name'] == key) {
				return this.states.fields[i];
			}
		}
	}
	return null;
};

export default Store
