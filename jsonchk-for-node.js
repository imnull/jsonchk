(function(){

var jst = require('js-type');

function LOG(log, msg){
	if(!jst.isArray(log)) return;
	log.push(msg);
}

function JSONStructChecker(schema, target, log, namespace){
	if(!jst.isObject(target)) {
		LOG(log, [namespace || '', 'fatal', 'not a object', schema, target]);
		return false;
	}

	namespace = namespace || '';

	for(var p in schema){

		var exp = schema[p];
		var ns = namespace + '.' + p;
		var _log = [ns, 'unknown schema', 'not implement', exp, target[p]];

		//type check
		if(jst.isString(exp)){
			_log[1] = 'string type-check';
			_log[2] = 'not match';
			if(exp == '*' || jst.tstr(target[p]) == exp || jst.ostr(target[p]) == exp){
				continue;
			} else if(exp == '@') {
				if(jst.tstr(target[p]) == 'undefined'){
					continue;
				}
				if(JSONStructChecker(schema, target[p], log, ns)){
					continue;
				} else {
					_log[1] = 'nest object-check';
					_log[2] = 'nest inner error';
					LOG(log, _log);
					return false;
				}
			} else {
				LOG(log, _log);
				return false;
			}
		} else if(jst.isRegExp(exp)){
			_log[1] = 'regexp type-check';
			_log[2] = 'not match';
			if(exp.test(jst.tstr(target[p])) || exp.test(jst.ostr(target[p]))){
				continue;
			} else {
				//_log[1] = 'regexp check';
				LOG(log, _log);
				return false;
			}
		}
		//function-return check
		else if(jst.isFunction(exp)){
			_log[1] = 'function value-check';
			_log[2] = 'not pass';
			if(exp(target[p], _log, ns)){
				continue;
			} else {
				LOG(log, _log);
				return false;
			}
		}
		//nest check
		else if(jst.isObject(exp)) {
			_log[1] = 'nest object-check';
			if(!(p in target)){
				_log[2] = 'not exists'
				LOG(log, _log);
				return false;
			} else if(!JSONStructChecker(exp, target[p], log, ns)){
				_log[2] = 'nest inner error'
				LOG(log, _log);	
				return false;
			} else {
				continue;
			}
		} 
		//unknown schema label type
		else {
			LOG(log, _log);
			return false;
		}
	}
	return true;
}

module.exports = JSONStructChecker;

})()	


