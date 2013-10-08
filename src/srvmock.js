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
	function generateData(schema) {
		//read the schema and generate an empty row data
		var fields = schema.fields,
			field,
			len = fields.length,
			i = 0,
			data = {};


		for(i; i < len; i++) {
			field = fields[i];

			if(field.type === 'number') {
				data[field.name] = ~~(Math.random() * Math.pow(10, field.size));
			} else {
				data[field.name] = LOREM.substr(~~(Math.random() * 15), field.size);
			}
		}

		return data;


	}
	/******END OF - Data generator***/



	/******************/

	//returns a list of fake data based on a schema
	function httpGet(schemaName, qt) {
		var rows = [],
			i = 0,
			schema = SCHEMA.get(schemaName);

		if(!schema) {
			throw new Error("Schema '" + schemaName + "' not found");
		}

		for(i; i < qt; i++) {
			rows.push(generateData(schema));
		}

		return rows;
	}


	//insert
	function httpPost(){}
	/******************/

	window.srvmock = {
		setSchema: setSchema,
		getSchema: getSchema,
		removeSchema: removeSchema,
		getSchemaNames: getSchemaNames,

		httpGet: httpGet
	};

})(this);