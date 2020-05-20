import {SchemaObject} from "openapi3-ts"
import {BreakPoint, position, Positioner} from "./positioners"
import {parseSchemaObjectToFormDefinition} from "./parseSchemaObjectToFormDefinition";

export const parseOpenApiSchema = (openAPISchema:SchemaObject, responsivePositioners: { [key in BreakPoint]?: Positioner }) =>
  position(
    parseSchemaObjectToFormDefinition(openAPISchema),
    responsivePositioners
  )
