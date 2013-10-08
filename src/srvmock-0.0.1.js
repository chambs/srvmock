'use strict';

;var zon = (function(document, window, undefined) {

    //Object.create polyfill
    if (!Object.create) {
        Object.create = function (o) {
            if (arguments.length > 1) {
                throw new Error('Object.create implementation only accepts the first parameter.');
            }
            function F() {}
            F.prototype = o;
            return new F();
        };
    }

    //make it work on IE < 8
    if (!window.localStorage) {
      window.localStorage = {
        getItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
          return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },
        key: function (nKeyId) {
          return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
        },
        setItem: function (sKey, sValue) {
          if(!sKey) { return; }
          document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
          this.length = document.cookie.match(/\=/g).length;
        },
        length: 0,
        removeItem: function (sKey) {
          if (!sKey || !this.hasOwnProperty(sKey)) { return; }
          document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          this.length--;
        },
        hasOwnProperty: function (sKey) {
          return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
      };
      window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
    }

    function all() {
        var result = {}, obj, k, offset;

        for(var i=0; i < localStorage.length; i++) {
            k = localStorage.key(i);
            offset = k.indexOf(this.tbname + '|');

            if(offset > -1) {
                try {
                    obj = JSON.parse(localStorage.getItem(k));
                } catch(err) {
                    obj = localStorage.getItem(k);
                }
                result[k.substr(k.indexOf('|')+1)] = obj;
            }
        }
        
        return result;
    }
    
    function size() {
        var k, offset;
        var count = 0;

        for(var i=0; i < localStorage.length; i++) {
            k = localStorage.key(i);
            offset = k.indexOf(this.tbname + '|');

            if(offset > -1) {
                count++;
            }
        }
        
        return count;
    }
    
    function iterate(fn) {
        var result = {}, obj, k, offset;

        for(var i=0; i < localStorage.length; i++) {
            k = localStorage.key(i);
            offset = k.indexOf(this.tbname + '|');

            if(offset > -1) {
                try {
                    obj = JSON.parse(localStorage.getItem(k));
                } catch(err) {
                    obj = localStorage.getItem(k);
                }
                
                fn(i, k.substr(k.indexOf('|')+1, k.length), obj);
            }
        }
        
        return result;
    }

    function get(k) {
        var obj;

        try {
            obj = JSON.parse(localStorage.getItem(this.tbname + '|' + k));
        } catch(err) {
            obj = localStorage.getItem(this.tbname + '|' + k);
        }
        return obj;
    }

    function insert(data, id) {
        if(!id) {
            id = generateId();
        }
    
        if(typeof(data) === 'object') {
            data = JSON.stringify(data);
        }

        localStorage.setItem(this.tbname + '|' + id, data);
        return id;
    }
    
    function remove(id) {
        localStorage.removeItem(this.tbname + '|' + id);
    }
    
    function update(id, data) {

        if(typeof(data) === 'object') {
            data = JSON.stringify(data);
        }

        localStorage.setItem(this.tbname + '|' + id, data);
    }
    
    function generateId() {
        return Date.now() + '' + Math.round(Math.random()*1e9);
    }
    
    var tmpTbl = {
        insert: insert,
        add: insert,
        set: insert,
        findOne: get,
        get: get,
        del: remove,
        remove: remove,
        all: all,
        iterate: iterate,
        each: iterate,
        update: update,
        size: size,
        length: size
    };
    
    //stores table objects already called
    var cachedTables = {};
    
    function tbls(tableName) {
        if(tableName in cachedTables) {
            return cachedTables[tableName];
        }
    
        var obj = Object.create(tmpTbl);
        obj.tbname = tableName;
        cachedTables[tableName] = obj;
        return obj;
    }
    
    return tbls;
})(document, window);
;(function(window) {

	/*
	Schema must follow these rules:

	var mySchema = {
		name: 'users',
		fields: [
			{name: 'id', type: 'number', size: 20},
			{name: 'name', type: 'string', size: 20}
		]
	};
	*/

	/**********Schema CRUD********/
	//some constants
	var SCHEMA = zon('SCHEMA'),
		LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fringilla lorem mauris, eget suscipit odio pulvinar eget. Sed gravida, mi ut eleifend mollis, odio nunc posuere risus, ut placerat lectus mi eu sapien. Proin sed velit in libero consectetur pulvinar a non augue. Aliquam a urna in est tempus porta at quis orci. Praesent semper neque enim, at mollis purus semper sit amet. Ut hendrerit mi non mauris consectetur, quis auctor est vulputate. Morbi lobortis rhoncus imperdiet. Integer sit amet pulvinar mi. Praesent aliquam sapien quis nunc adipiscing viverra.';

	//add or update a new schema
	function setSchema(schema) {
		var rowId = SCHEMA.add(schema, schema.name);
	}

	//remove a schema
	function removeSchema(schemaName) {
		SCHEMA.remove(schemaName);
	}

	//get a schema by its name
	function getSchema(schemaName) {
		return SCHEMA.get(schemaName);
	}

	//returns a list of saved schemas
	function getSchemaNames() {
		var names = [];
		SCHEMA.each(function(index, rowId, data) {
			names.push(data.name);
		});

		return names;
	}
	/**********END OF - Schema CRUD********/

	/******Data generator************/
	function generateData(schema, sg, ng) {
		//read the schema and generate an empty row data
		var fields = schema.fields,
			field,
			len = fields.length,
			i = 0,
			data = {};

		sg = sg || stringGen;
		ng = ng || numberGen;


		for(i; i < len; i++) {
			field = fields[i];

			if(field.type === 'number') {
				data[field.name] = ng(field.size);
			} else {
				data[field.name] = sg(field.size);
			}
		}

		return data;
	}

	//String generator
	function stringGen(size) {
		return LOREM.substr(~~(Math.random() * 100), size);
	}

	//Number generator
	function numberGen(size) {
		return ~~(Math.random() * Math.pow(10, size));
	}


	/******END OF - Data generator***/



	/******************/

	//returns a list of fake data based on a schema
	function httpGet(schemaName, qt, sg, ng) {
		var rows = [],
			i = 0,
			schema = SCHEMA.get(schemaName);

		//retrive data from the localStorage data
		zon(schemaName + '_DATA').each(function(index, rowId, data) {
			//uses zon's id as backup, in case the schema hasn't one
			data._id = rowId;
			rows.push(data);
		});

		//if qt is passed, returns a list of ugly fake data of length = qt
		//according to the schema
		if(qt) {
			if(!schema) {
				throw new Error("Schema '" + schemaName + "' not found");
			}

			for(i; i < qt; i++) {
				rows.push(generateData(schema, sg, ng));
			}
		}

		return rows;
	}


	//insert
	function httpPost(schemaName, data) {
		var schema = SCHEMA.get(schemaName),
			newRow = {},
			fields = schema.fields,
			field,
			len = fields.length,
			i = 0,
			rowId;

		for(i; i < len; i++) {
			field = fields[i];
			newRow[field.name] = data[field.name];
		}

		rowId = zon(schemaName + '_DATA').add(newRow);

		return rowId;
	}

	/******************/

	window.srvmock = {
		setSchema: setSchema,
		getSchema: getSchema,
		removeSchema: removeSchema,
		getSchemaNames: getSchemaNames,

		httpGet: httpGet,
		httpPost: httpPost
	};

})(this);