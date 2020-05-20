import {OpenAPIObject, OperationObject, RequestBodyObject} from "openapi3-ts";
import {SchemaObject} from "openapi3-ts/src/model/OpenApi";

const getSchemaObjectFromOperationObject = (operationObject:OperationObject):SchemaObject|undefined =>
  (operationObject?.requestBody as RequestBodyObject)?.content?.["application/json"]?.schema

export const getSchemaObjects = (openAPIObject:OpenAPIObject) =>
  Object
    .entries(openAPIObject.paths)
    .reduce((acc, [pathname, pathObject]) => {

      if (pathObject.patch) {
        const schema = getSchemaObjectFromOperationObject(pathObject.patch)
        if (schema) {
          acc[`PATCH ${pathname}`] = schema
        }
      }

      if (pathObject.put) {
        const schema = getSchemaObjectFromOperationObject(pathObject.put)
        if (schema) {
          acc[`PUT ${pathname}`] = schema
        }
      }

      if (pathObject.post) {
        const schema = getSchemaObjectFromOperationObject(pathObject.post)
        if (schema) {
          acc[`POST ${pathname}`] = schema
        }
      }

      return acc;

    }, {} as Record<string, SchemaObject>)
