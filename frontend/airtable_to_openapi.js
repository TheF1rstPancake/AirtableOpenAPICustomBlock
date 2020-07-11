/** 
 * Map Airtable datatypes to the corresponding OPENAPI datatypes 
 * If Airtable adds more data types over time, we will need to add them here
 */
const AIRTABLE_TO_OPENAPI_DEFS = {
  'singleLineText': {
    'type': 'string'
  },
  'email': {
    'type': 'string'
  },
  'url': {
    'type': 'string'
  },
  'multilineText': {
    'type': 'string'
  },
  'number': {
    'type': 'integer'
  },
  'percent': {
    'type': 'integer'
  },
  'currency': {
    'type': 'integer'
  },
  'singleSelect': {
    'type': 'string'
  },
  'multipleSelects': {
    'type': 'array',
    'items': {
      'type': 'string'
    }
  },
  'singleCollaborator': {
    'type': 'object',
    'properties': {
      'name': {
        'type': 'string',
        'description': "user's display name (optional, may be empty if the user hasn't created an account)"
      },
      'email': {
        'type': 'string',
        'format': 'email',
        'description': "user's email address"
      },
      'id': {
        'type': 'string',
        'description': 'unique user id'
      },
    },
    required: ['email', 'id']
  },
  'multipleCollaborators': {
    type: 'array',
    'items': {
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string',
          'description': "user's display name (optional, may be empty if the user hasn't created an account)"
        },
        'email': {
          'type': 'string',
          'format': 'email',
          'description': "user's email address"
        },
        'id': {
          'type': 'string',
          'description': 'unique user id'
        },
      },
      required: ['email', 'id']
    }
  },
  'multipleRecordLinks': {
    type: 'array',
    items: {
      'type': 'string',
      description: 'Record IDs that the current record links to'
    }
  },
  'date': {
    'type': 'string',
    format: 'date'
  },
  'dateTime': {
    'type': 'string',
    format: 'date-time'
  },
  'phoneNumber': {
    'type': 'string'
  },
  'multipleAttachments': {
    'type': 'array',
    'items': {
      type: 'object',
      properties: {
        'id': {
          'type': 'string'
        },
        'size': {
          'type': 'integer'
        },
        'url': {
          type: 'string',
          format: 'url'
        },
        'filename': {
          type: 'string'
        },
        'thumbnails': {
          'type': 'object',
          'properties': {
            'small': {
              'type': 'object',
              properties: {
                'url': {
                  'type': 'string'
                },
                'width': {
                  'type': 'integer'
                },
                'height': {
                  'type': 'integer'
                }
              }
            },
            'large': {
              'type': 'object',
              properties: {
                'url': {
                  'type': 'string'
                },
                'width': {
                  'type': 'integer'
                },
                'height': {
                  'type': 'integer'
                }
              }
            }
          }
        }
      }
    }
  },
  'checkbox': {
    'type': 'boolean'
  },
  'formula': {
    'type': null
  },
  'createdTime': {
    'type': 'string',
    format: 'date-time'
  },
  'rollup': {
    'type': null
  },
  'count': {
    'type': 'integer'
  },
  'multipleLookupValues': {
    'type': null
  },
  'autoNumber': {
    'type': 'integer'
  },
  'barcode': {
    'type': 'object',
    properties: {
      'text': {
        type: 'string'
      },
      'type': {
        type: 'string'
      }
    }
  },
  'rating': {
    'type': 'integer'
  },
  'richText': {
    'type': 'string'
  },
  'duration': {
    'type': 'integer'
  },
  'lastModifiedTime': {
    'type': 'string',
    format: 'date-time'
  },
  'button': {
    type: 'object',
    properties: {
      label: {
        type: 'string'
      },
      url: {
        type: 'string',
        format: 'url'
      }
    }
  }
};


/**
 * Get the object which represents a given "table" in our OPENAPI schema
 * Each table is a different set of endpoints and there are certain options 
 * that are the same for all tables and not uniquely generated based on schema
 * (i.e GET query parameters)
 * 
 * @param {Table}     table the Airtable table we are building the OpenAPI spec for
 * @returns {object}  the shell of an OPENAPI schema definition for a given endpoint
 */
function getTableTemplate(table) {
  var table_structure = {
    get: {
      tags: [table.name],
      summary: 'Get records',
      parameters: [{
          "in": "query",
          "name": "fields",
          "schema": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        {
          "in": "query",
          "name": "filterByFormula",
          "schema": {
            "type": "string"
          }
        },
        {
          "in": "query",
          "name": "maxRecords",
          "schema": {
            "type": "integer"
          }
        },
        {
          "in": "query",
          "name": "pageSize",
          "schema": {
            "type": "integer"
          }
        },
        {
          "in": "query",
          "name": "sort",
          "schema": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "field": {
                  "type": "string"
                },
                "direction": {
                  "type": "string",
                  "enum": [
                    "asc",
                    "desc"
                  ],
                  "default": "asc"
                }
              },
              "required": ["field"]
            }
          }
        },
        {
          "in": "query",
          "name": "view",
          "schema": {
            "type": "string"
          }
        },
        {
          "in": "query",
          "name": "cellFormat",
          "schema": {
            "type": "string",
            "enum": [
              "json",
              "string"
            ],
            "default": "json"
          }
        },
        {
          "in": "query",
          "name": "timeZone",
          "schema": {
            "type": "string"
          }
        },
        {
          "in": "query",
          "name": "userLocale",
          "schema": {
            "type": "string"
          }
        },
        {
          "in": "query",
          "name": "offset",
          "schema": {
            "type": "string"
          }
        }
      ],
      responses: {
        200: {}
      }
    },
    post: {
      tags: [table.name],
      summary: 'Create new record(s)',
      requestBody: {},
      responses: {
        200: {}
      }
    },
    patch: {
      tags: [table.name],
      summary: 'Partially update existing record(s). Missing fields in request are not modified',
      requestBody: {},
      responses: {
        200: {}
      }
    },
    put: {
      tags: [table.name],
      summary: 'Update existing record(s). Missing fields in the request are updated to null/empty.',
      requestBody: {},
      responses: {
        200: {}
      }
    },
    delete: {
      tags: [table.name],
      summary: 'Delete record(s)',
      parameters: [{
        in: 'query',
        name: 'records',
        schema: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }],
      responses: {
        200: {
          description: 'OK',
          content: {
            "application/json": {
              schema: {
                type: 'object',
                properties: {
                  'records': {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        'id': {
                          type: 'string'
                        },
                        'deleted': {
                          type: 'boolean'
                        }
                      },
                      required: ['id', 'deleted']
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return table_structure;
}


/**
 * Build the template for all endpoints that only take action on a single record
 * Airtable's API allow you to GET, PATCH, PUT and DELETE by a single ID
 * it has a different API path -- `{base_path}/{table.name}/{record_id}
 * the response will also just be a single record rather than an array of records
 * the request takes nothing other than the record_id parameter
 * 
 * @param {Table} table Airtable table we are building the OpenAPI schema for
 */
function getSingleRecordTableTemplate(table) {
  return {
    get: {
      tags: [table.name],
      summary: 'Get record',
      parameters: [{
        "in": "path",
        "name": "record_id",
        "schema": {
          "type": "string"
        },
        required: true
      }],
      responses: {
        200: {}
      }
    },
    patch: {
      tags: [table.name],
      summary: 'Partially update existing record(s). Missing fields in request are not modified',
      parameters: [{
        in: 'path',
        name: 'record_id',
        schema: {
          type: 'string',
        },
        required: true
      }],
      requestBody: {},
      responses: {
        200: {}
      }
    },
    put: {
      tags: [table.name],
      summary: 'Update existing record. Missing fields in the request are updated to null/empty.',
      parameters: [{
        in: 'path',
        name: 'record_id',
        schema: {
          type: 'string',
        },
        required: true
      }],
      requestBody: {},
      responses: {
        200: {}
      }
    },
    delete: {
      tags: [table.name],
      summary: 'Delete record',
      parameters: [{
        in: 'path',
        name: 'record_id',
        schema: {
          type: 'string',
        },
        required: true
      }],
      responses: {
        200: {
          description: 'OK',
          content: {
            "application/json": {
              schema: {
                type: 'object',

                properties: {
                  'id': {
                    type: 'string'
                  },
                  'deleted': {
                    type: 'boolean'
                  }
                },
                required: ['id', 'deleted']
              }
            }
          }
        }
      }
    }
  };
}

/**
 * Using our AIRTABLE_OPENAPI_DEFS map, convert an Airtable field type to the corresponding 
 * OpenAPI Field Def
 * @param {Field}   f Airtable field object we need to convert into an OpenAPI field definition
 */
function getFieldType(f) {
  var field_schema = AIRTABLE_TO_OPENAPI_DEFS[f.type];
  // convert the Airtable type to OpenAPI type
  // if the type is null, then this is a computed field and we need to convert the resulting type
  if (field_schema.type === null) {
    field_schema = AIRTABLE_TO_OPENAPI_DEFS[f.options.result.type];
  } else if (field_schema === undefined) {
    console.log(`WARN: cannot find OpenAPI definition for Airtable field type ${f.type}`);
    return {};
  }

  // add a description and any special metadata
  // for example, the enum options for single or multi selects
  field_schema.description = f.description;
  if (f.type === 'singleSelect' || f.type === 'multipleSelects') {
    field_schema.enum = f.options.choices.map((o) => {
      return o.name
    });
  }
  return field_schema;
}

/**
 * Given a table, iterate over each field and build the complete schema for the objects that this table represents
 * @param {Table}  table_schema the Airtable table object 
 */
function generateSchema(table_schema) {
  var schema = {};
  for (let f of table_schema.fields) {
    schema[f.name] = getFieldType(f);
  }

  return {
    type: 'object',
    properties: schema
  }
}

/**
 * Given a schema definition name (i.e. the name of a table) build the API schema for issuing requests on that object 
 * @param {string} schema_name  the name of the object definition.  This is created by passing a tables name to `getSchemaName`
 * @param {boolean} is_array  should be true if the request expects an array of objects instead of a single object 
 */
function generateRequestSchema(schema_name, is_array) {
  var request_objects = {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      fields: {
        "$ref": `#/components/schemas/${schema_name}`
      }
    }
  }

  // if our response should be an array of objects, manage that here
  // we also need to insert the "typecast" parameter in a different spot for 
  // single record vs array of record ops
  if (is_array === true) {
    request_objects = {
      type: 'object',
      properties: {
        records: {
          type: 'array',
          items: request_objects
        },
        typecast: {
          type: 'boolean',
          default: false
        }
      }
    }
  } else {
    request_objects.properties.typecast = {
      type: 'boolean',
      default: false
    }
  }

  return {
    content: {
      'application/json': {
        schema: request_objects
      }
    }
  }
}

/**
 * Given a schema definition name (i.e. the name of a table) build the schema for what a response from the API will look like on that object
 * @param {string} schema_name  the name of the object definition.  This is created by passing a tables name to `getSchemaName`
 * @param {boolean} is_array  should be true if the response returns an array of objects instead of a single object 
 */
function generateResponseBody(schema_name, is_array) {
  var response_objects = {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      },
      createdTime: {
        type: 'string',
        format: 'date-time'
      },
      fields: {
        "$ref": `#/components/schemas/${schema_name}`
      }
    }
  }

  if (is_array === true) {
    response_objects = {
      type: 'object',
      properties: {
        records: {
          type: 'array',
          items: response_objects
        }
      }
    }
  }

  return {
    description: 'OK',
    content: {
      'application/json': {
        schema: response_objects
      }
    }
  };
}

/**
 * Schema names in OPENAPI cannot have spaces.  So strip spaces from our table names
 * Given that table names can have a wide array of formatting, there may be additional modifications we have to perform here
 * 
 * @param {string} table  name of the table
 */
function getSchemaName(table) {
  return table.name.replace(/\s/g, '');
}


/**
 * Given a base, represent its schema using the OpenAPI format.
 * To accomplish this, we create a skeleton object for the OpenAPI schema
 * For each table, we create a "definition" at the top level of the schema that we then reference
 * in the API definitions for each endpoint.
 * This object does represent all endpoints (i.e. both batch and single request)
 * @param {Base} base 
 */
function baseToOpenAPI(base) {

  const base_path = `/${base.id}`;
  var base_structure = {
    openapi: '3.0.0',
    info: {
      title: `${base.name}'s API`,
      description: `Airtable API definition for CRUD operations into ${base.name}`,
      version: 'v0'
    },
    servers: [{
      url: 'https://api.airtable.com/v0',
      description: 'API URL'
    }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer'
        }
      },
      schemas: {}
    },
    security: [{
      BearerAuth: []
    }],
    paths: {
      // this is where we will place each table's structure
      // the airtable API is /{base_id}/{table_name} and then supports CRUD on each
    }
  };



  // for get, post and patch, we can generate the response payloads
  // these will be very similar to the POST/PATCH parameter options
  // GET will have it's own PATH parameters that is the same for all GET endpoints
  // DELETE is also static and not dependent on the base schema
  for (var table of base.tables) {
    var table_structure = getTableTemplate(table);
    var content_def = generateSchema(table);

    // assign the component schema so we can reference it in the request and response portions
    var schema_name = getSchemaName(table);
    base_structure.components.schemas[schema_name] = content_def

    // generate the corresponding request and repsonse objects
    // using the schema name to reference the object we created earlier
    // this should help keep the resulting output cleaner (rather than duplicating the same object in multiple places)
    var response_body = generateResponseBody(schema_name, true);
    var request_schema = generateRequestSchema(schema_name, true);

    // update the post,patch and put request schemas
    table_structure.post.requestBody = request_schema;
    table_structure.patch.requestBody = request_schema;
    table_structure.put.requestBody = request_schema;

    // update the post, get, patch and put response schemas.
    table_structure.post.responses[200] = response_body;
    table_structure.patch.responses[200] = response_body;
    table_structure.put.responses[200] = response_body;

    // get has some extra properites we need to insert
    table_structure.get.responses[200] = response_body;
    table_structure.get.responses[200].content['application/json'].schema.properties.offset = {
      type: 'string'
    }


    // write the total schema at `/table.name`.
    const table_path = `${base_path}/${table.name}`;
    base_structure.paths[table_path] = table_structure;

    // now do the same for single record paths
    const single_record = getSingleRecordTableTemplate(table);

    var single_response_body = generateResponseBody(schema_name);
    var single_request_schema = generateRequestSchema(schema_name);

    // update the post,patch and put request schemas
    single_record.patch.requestBody = single_request_schema;
    single_record.put.requestBody = single_request_schema;

    // update the post, get, patch and put response schemas.
    single_record.get.responses[200] = single_response_body;
    single_record.patch.responses[200] = single_response_body;
    single_record.put.responses[200] = single_response_body;

    const single_record_path = `${base_path}/${table.name}/{record_id}`;
    base_structure.paths[single_record_path] = single_record;

  }
  return base_structure;
}


module.exports = {
  AIRTABLE_TO_OPENAPI_DEFS: AIRTABLE_TO_OPENAPI_DEFS,
  baseToOpenAPI: baseToOpenAPI
};