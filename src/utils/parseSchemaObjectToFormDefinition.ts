import { SchemaObject } from "openapi3-ts/src/model/OpenApi"
import { ScaffoldFieldsType } from "amsterdam-react-final-form"
import {arrayToObject} from "./arrayToObject";
import {humanize, humanizeOptions} from "./humanize";
import {horizontalPositioner, position} from "./positioners";

export const generateStandardFields = (prefix: string, propertyName: string, schemaObject:SchemaObject) => ({
  position: {},
  name: prefix+propertyName,
  hint: schemaObject.description,
  label: schemaObject.title ?? humanize(propertyName)
})

export const generateFormDefinitionKey = (prefix:string, propertyName:string) =>
  (prefix + "" + propertyName).replace(/\./g, '_')

export const equalColumns = (num:number, buttonGutter:boolean) => {
  const fractions = [...Array(num)].map(_ => "1fr")
  if (buttonGutter) {
    fractions.push("auto")
  }
  return fractions.join(" ");
}

export const parseSchemaObjectToFormDefinition = (schemaObject:SchemaObject, prefix:string = "", indexOffset:number = 0):ScaffoldFieldsType => {

  const parseField = (acc:ScaffoldFieldsType, key:string, propertyName:string, property:SchemaObject, index:number) => {

    switch(property.type) {
      case "object":
        const object = parseSchemaObjectToFormDefinition(property, propertyName+ ".", index + indexOffset)
        indexOffset += Object.keys(object).length
        acc = { ...acc, ...object }
        break;
      case "string":
        if (property.enum) {
          acc[key] = {
            type: "SelectField",
            props: {
              options: humanizeOptions(arrayToObject(property.enum)),
              ...generateStandardFields(prefix, propertyName, property)
            }
          }
        } else {
          acc[key] = {
            type: "TextField",
            props: {
              ...generateStandardFields(prefix, propertyName, property)
            }
          }
        }
        break;
      case "boolean":
        acc[key] = {
          type: "Boolean",
          props: {
            ...generateStandardFields(prefix, propertyName, property)
          }
        }
        break;
      case "number":
      case "integer":
        acc[key] = {
          type: "NumberField",
          props: {
            ...generateStandardFields(prefix, propertyName, property)
          }
        }
        break;
      case "array":

        const items = ((property?.items as SchemaObject)?.type === "object")
          ? property.items!
          : { properties: { "": property.items! } }

        const scaffoldFields = position(
          parseSchemaObjectToFormDefinition(items),
          "mobileS",
          horizontalPositioner
        )

        acc[key] = {
          type: "ArrayField",
          props: {
            scaffoldFields,
            allowAdd: true,
            allowRemove: true,
            columns: equalColumns(Object.keys(scaffoldFields).length, true),
            ...generateStandardFields(prefix, propertyName, property),
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

  return Object
    .entries(properties)
    .reduce((acc, [propertyName, property], index) => {
      const key = generateFormDefinitionKey(prefix, propertyName)

      if (property.allOf) {
        return property
          .allOf
          .reduce((acc:ScaffoldFieldsType, property:SchemaObject) => parseField(acc, key, propertyName, property, index), acc)

      } else if(property.oneOf) {
        console.warn("property.oneOf detected! We haven't implemented that yet!")

        // TODO don't think this is the ideal situation.
        return property
          .oneOf
          .reduce((acc:ScaffoldFieldsType, property:SchemaObject) => parseField(acc, key, propertyName, property, index), acc)

      } else {
        return parseField(acc, key, propertyName, property, index)
      }

    }, {} as ScaffoldFieldsType)
}
