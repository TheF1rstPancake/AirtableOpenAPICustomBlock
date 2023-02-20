import {
  initializeBlock,
  useBase,
  loadCSSFromString,
  Button,
} from "@airtable/blocks/ui";

import { baseToOpenAPI } from "./airtable_to_openapi";
import SwaggerUI from "swagger-ui-react";
import ReactJson from "react-json-view";

import { css } from "./css";
import React, { useState } from "react";
import { Buffer } from 'buffer';
global.Buffer = Buffer;

loadCSSFromString(css);

function AirtableToOpenAPI() {
  // useBase ensures that we recalculate the OpenAPI schema if there are any changes to the base schema
  const base = useBase();

  // create the Open API schema by reading the base's schema
  const schema = baseToOpenAPI(base);

  // allow the user to toggle so they can see the raw schema that is powering the UI
  const [full_schema_toggle, updateFullSchemaToggle] = useState(false);

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <Button
          onClick={() => updateFullSchemaToggle(!full_schema_toggle)}
          icon="gantt"
        >
          {full_schema_toggle === false ? "Show Full Schema" : "Return"}
        </Button>
      </div>
      <div style={{ margin: "10px" }}>
        {full_schema_toggle === false ? (
          <SwaggerUI spec={schema} />
        ) : (
          <div>
            <h3>Full Schema</h3>
            <ReactJson src={schema} theme="monokai" collapsed={true} />
          </div>
        )}
      </div>
    </div>
  );
}

initializeBlock(() => <AirtableToOpenAPI />);
