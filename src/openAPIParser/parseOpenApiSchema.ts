import {SchemaObject} from "openapi3-ts"
import {parseSchemaObjectToFormDefinition} from "./parseSchemaObjectToFormDefinition";
import {FormPositioner} from "../grid/FormPositioner";

export const parseOpenApiSchema = (openAPISchema:SchemaObject) =>
  new FormPositioner(parseSchemaObjectToFormDefinition(openAPISchema))

