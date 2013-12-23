JSON Struct Checker (for NodeJS)
================================
# 1. 说明
这是一个对JSON数据（或其他JS对象）的数据结构进行校验的函数。
在编程过程中，可以通过编写一个JSON结构的Schema，来表示你所预期的数据结构，然后使用该函数对目标进行检查。
函数会返回Boolean类型的检查结果；如果检查未通过，函数会形成一个Array结构的日志文件供调试审阅。

用于Web的Repo: [https://github.com/imnull/json-struct-checker](https://github.com/imnull/json-struct-checker)

# 2. 安装

    npm install jsonchk
npm上的项目地址：[https://npmjs.org/package/jsonchk](https://npmjs.org/package/jsonchk)

# 3. 示例
示例代码请参看：[https://github.com/imnull/jsonchk/blob/master/test.js](test.js)

## 3.1 类型判断
### 3.1.1 类型字符串比对
    //数据中应具备一个名为name，值的typeof为string的属性
    var schema = { name : 'string' };
    var data = { name : 'MK' };

    //数据中应具备一个名为days，Object.prototype.toString回调其值为[object Array]的属性
    var schema = { days : '[object Array]' };
    var data = { days : [1,2,3] };

### 3.1.2 类型字符串的正则比对
    //值类型为string或Array
    var schema = { name : '/^(string|\[object Array\])$/' };
    var data1 = { name : 'MK' };
    var data2 = { name : ['MK'] };

## 3.2 函数对值的判断
    var schema = {
      age : function(val){
        return typeof(val) == 'number' && val >= 0 && val <= 120;
      }
    };

    var data1 = { age : 24 };
    var data2 = { age : -1 };

## 3.3 嵌套判断
    var schema = {
      child : {
        name : 'string',
        age : 'number',
        wife : '^(undefined|\[object Object\])$'
      }
    }
    var data1 = {
      child : {
        name : 'Even',
        age : 6
      }
    }
    var data2 = {
      child : {
        name : 'John',
        age : 55,
        wife : {
          //...
        }
      }
    }

# 4. 特殊字符
## 4.1 特殊类型字符
### 4.1.1 "*" 允许所有类型

    var schema = { style : '*' };
    var data1 = { style : "width:20px" };
    var data2 = { style : { width : '20px' } }
    var data3 = {};

## 4.2 特殊引用字符
### 4.2.1 "@" 引用父级schema进行检测

    var schema = {
      name : 'string',
      age : 'number',
      wife : '@'
    }

    var data1 = {
      name : 'John',
      age : 55
    }

    var data2 = {
      name : 'Li Lei',
      age : 24,
      wife : {
        name : 'Han Meimei',
        age : 23
      }
    }

# 5. 关于log参数
该参数为外部引用变量，类型为数组。如果代入该引用，那么当检查出现错误时，会向此参数推入一条记录。一条记录为一个数组，按顺序为：
    namespace, error-type, error-description, current-checker, current-value

# 6. 关于namespace参数
表述出错时的层级关系
