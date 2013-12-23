var jchk = require('jsonchk');

var schema = {
	name : 'string',
	gender : /number|undefined/,
	age : function(v, log, ns){
		if(typeof(v) != 'number'){
			log[2] = ns + ' type error';
			return false;
		} else if(v < 0 || v > 120) {
			log[2] = ns + ' out of range';
			return false;
		}
		return true;
	},
	wife : {
		name : /string|undefined/,
		age : /number|undefined/
	},
	children : '@'
}

function explain(logs){
	var s = '';
	for(var i = 0, len = logs.length; i < len; i++){
		var log = logs[i];
		s += 'namespace \t: ' + log[0]
			+ '\nschema-state \t: ' + log[1]
			// + '\n--------------------------------------'
			+ '\ndata-state \t: ' + log[2]
			// + '\nschema \t\t: ' + log[3]
			+ '\ndata \t\t\t: ' + log[4]
			// + '\n--------------------------------------'
			+ '\n--------------------------------------\n'
			;
	}
	return s;
}

var datas = [
	{ },
	{ name : 1 },
	{ name : "John", gender : "1" },
	{ name : "John", age : "" },
	{ name : "John", age : 500 },
	{ name : "John", age : 54 },
	{ name : "John", age : 54, wife : {} },
	{ name : "John", age : 54, wife : { name : "Rose", age : "52" } },
	{ name : "John", age : 54, wife : { name : "Rose" }, child : {} },
	{ name : "John", age : 54, wife : { name : "Rose" }, child : { name : 'Tom', age : 12, wife : {} } },

]
console.log('schema: \n', schema);
console.log('---------- test --------------')
for(var i = 0, len = datas.length; i < len; i++){
	var log = [];
	var r = jchk(schema, datas[i], log, 'datas[' + i + ']');
	console.log(r + ':', datas[i]);
	console.log(explain(log));
}

