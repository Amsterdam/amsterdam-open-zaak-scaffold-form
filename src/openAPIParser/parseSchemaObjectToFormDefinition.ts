import { SchemaObject } from "openapi3-ts/src/model/OpenApi"
import {arrayToObject} from "../utils/arrayToObject";
import {humanize, humanizeOptions} from "../utils/humanize";
import {parseOpenApiSchema} from "./parseOpenApiSchema";

import {equalColumns} from "../utils/equalColumns";
import {FormPositionerFields} from "../grid/FormPositioner";
import {ScaffoldAvailableFields} from "@amsterdam/amsterdam-react-final-form";
import {ScaffoldSubmitButtonProps} from "@amsterdam/amsterdam-react-final-form/components/final-form/Scaffold/ScaffoldField";

const submit:ScaffoldSubmitButtonProps = {
  type: "SubmitButton",
  props: {
    align: "right",
    label: "Opslaan"
  }
}

export const generateStandardProps = (prefix: string, propertyName: string, schemaObject:SchemaObject, required:string[]) => ({
  position: {},
  name: prefix+propertyName,
  hint: schemaObject.description,
  label: schemaObject.title ?? humanize(propertyName),
  disabled: schemaObject.readOnly ? true : undefined,
  isRequired: required.includes(propertyName) && !schemaObject.readOnly ? true : undefined
})

export const generateFormDefinitionKey = (prefix:string, propertyName:string) =>
  (prefix + "" + propertyName).replace(/\./g, '_')

type FormPositionerProps = FormPositionerFields<ScaffoldAvailableFields>

export const parseSchemaObjectToFormDefinition = (schemaObject:SchemaObject, prefix:string = "", indexOffset:number = 0):FormPositionerProps => {

  const required = schemaObject?.required ?? []

  const parseField = (acc:FormPositionerProps, key:string, propertyName:string, property:SchemaObject, index:number) => {

    switch(property.type) {
      case "object":
        if (property.properties) {
          const object = parseSchemaObjectToFormDefinition(property, propertyName+ ".", index + indexOffset)
          indexOffset += Object.keys(object).length

          Object
            .entries(object)
            .forEach(([key, val]) => {
              acc[key] = val;
            })
        } else {
          // Fall back to text
          acc[key] = {
            type: "TextField",
            props: {
              ...generateStandardProps(prefix, propertyName, property, required)
            }
          }
        }
//        acc = { ...acc, ...object }
        break;
      case "string":
        if (property.enum) {
          acc[key] = {
            type: "SelectField",
            props: {
              options: humanizeOptions(arrayToObject(property.enum)),
              ...generateStandardProps(prefix, propertyName, property, required)
            }
          }
        } else {
          acc[key] = {
            type: "TextField",
            props: {
              type: (property.format === "date") ? "date" : "text",
              ...generateStandardProps(prefix, propertyName, property, required)
            }
          }
        }
        break;
      case "boolean":
        acc[key] = {
          type: "Boolean",
          props: {
            ...generateStandardProps(prefix, propertyName, property, required)
          }
        }
        break;
      case "number":
      case "integer":
        acc[key] = {
          type: "NumberField",
          props: {
            ...generateStandardProps(prefix, propertyName, property, required)
          }
        }
        break;
      case "array":

        const items = ((property?.items as SchemaObject)?.type === "object")
          ? property.items!
          : { properties: { "": property.items! } }

        const scaffoldFields = parseOpenApiSchema(items)
          .setHorizontal("mobileS") // Align fields horizontally by default
          .getFields()

        delete scaffoldFields["submit"]

        acc[key] = {
          type: "ArrayField",
          props: {
            scaffoldFields,
            allowAdd: true,
            allowRemove: true,
            columns: equalColumns(Object.keys(scaffoldFields).length, true),
            ...generateStandardProps(prefix, propertyName, property, required),
          }
        }

        break;
      default:
        console.warn("Unknown type", property.type)
        break;
    }
    return acc;
  }

  const properties = schemaObject?.properties ?? {} as SchemaObject

  const fields = Object
    .entries(properties)
    .reduce((acc, [propertyName, property], index) => {
      const key = generateFormDefinitionKey(prefix, propertyName)

      if (property.allOf) {
        return property
          .allOf
          .reduce((acc:FormPositionerProps, property:SchemaObject) => parseField(acc, key, propertyName, property, index), acc)

      } else if(property.oneOf) {
        console.warn("property.oneOf detected! We haven't implemented that yet!")

        // TODO don't think this is the ideal situation.
        return property
          .oneOf
          .reduce((acc:FormPositionerProps, property:SchemaObject) => parseField(acc, key, propertyName, property, index), acc)

      } else {
        return parseField(acc, key, propertyName, property, index)
      }

    }, {} as FormPositionerProps)

    // Lastly:
    fields["submit"] = submit

    return fields
}
