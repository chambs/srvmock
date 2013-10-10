(function(window) {

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
	//plus the real data persisted on the localStorage
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

	//returns a row persisted on the localStorage
	function httpGetOne(schemaName, rowId) {
		var schema = SCHEMA.get(schemaName);

		//retrive data from the localStorage data
		return zon(schemaName + '_DATA').get(rowId);
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
		httpGetOne: httpGetOne,
		httpPost: httpPost
	};

})(this);
