(function(){

function ostr(val){ return Object.prototype.toString.call(val); }
function tstr(val){ return typeof(val); }

function isFunction(val){ return tstr(val) == 'function'; }
function isString(val){ return tstr(val) == 'string'; }
function isArray(val){ return ostr(val) == '[object Array]'; }
function isObject(val){ return ostr(val) == '[object Object]'; }
function isRegExp(val){ return ostr(val) == '[object RegExp]' } 
function isEmpty(val){ return tstr(val) == 'undefined' || val === null; }
function isValidObject(val){ return !isEmpty(val) && isObject(val); }

function LOG(log, msg){
	if(!isArray(log)) return;
	log.push(msg);
}

function JSONStructChecker(schema, target, log, namespace){
	if(!isValidObject(target)) {
		LOG(log, [namespace || '', 'fatal', 'not a object', schema, target]);
		return false;
	}

	namespace = namespace || '';

	for(var p in schema){

		var exp = schema[p];
		var ns = namespace + '.' + p;
		var _log = [ns, 'unknown schema', 'not implement', exp, target[p]];

		//type check
		if(isString(exp)){
			_log[1] = 'string type-check';
			_log[2] = 'not match';
			if(exp == '*' || tstr(target[p]) == exp || ostr(target[p]) == exp){
				continue;
			} else if(exp == '@') {
				if(tstr(target[p]) == 'undefined'){
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
		} else if(isRegExp(exp)){
			_log[1] = 'regexp type-check';
			_log[2] = 'not match';
			if(exp.test(tstr(target[p])) || exp.test(ostr(target[p]))){
				continue;
			} else {
				//_log[1] = 'regexp check';
				LOG(log, _log);
				return false;
			}
		}
		//function-return check
		else if(isFunction(exp)){
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
		else if(isValidObject(exp)) {
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

exports.jsonchk = JSONStructChecker;

})()	


