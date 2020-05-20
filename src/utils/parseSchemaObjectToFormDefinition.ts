import { SchemaObject } from "openapi3-ts/src/model/OpenApi"
import { ScaffoldFieldsType, FormGridCellDimensions } from "amsterdam-react-final-form"
import {Responsive} from "amsterdam-react-final-form/components/layout/responsiveProps";
import {arrayToObject} from "./arrayToObject";
import {humanize, humanizeOptions} from "./humanize";

export const columnPositioner = (
  numColumns: number,
  start:number = 0,
  positionObject:Responsive<FormGridCellDimensions> = {}
): Responsive<FormGridCellDimensions> => ({
  ...positionObject,
  mobileS: {
    column: start % numColumns,
    row: Math.floor(start / numColumns)
  }
})

export const generateStandardFields = (prefix: string, propertyName: string, schemaObject:SchemaObject) => ({
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

export const parseSchemaObjectToFormDefinition = (schemaObject:SchemaObject, numColumns:number = 1, prefix:string = "", indexOffset:number = 0):ScaffoldFieldsType => {

  const properties = schemaObject?.properties ?? {} as SchemaObject

  const parseField = (acc:ScaffoldFieldsType, key:string, propertyName:string, property:SchemaObject, index:number) => {
    switch(property.type) {
      case "object":
        const object = parseSchemaObjectToFormDefinition(property, numColumns, propertyName+ ".", index + indexOffset)
        indexOffset += Object.keys(object).length
        acc = { ...acc, ...object }
        break;
      case "string":
        if (property.enum) {
          acc[key] = {
            type: "SelectField",
            props: {
              position: columnPositioner(numColumns, index + indexOffset),
              options: humanizeOptions(arrayToObject(property.enum)),
              ...generateStandardFields(prefix, propertyName, property)
            }
          }
        } else {
          acc[key] = {
            type: "TextField",
            props: {
              position: columnPositioner(numColumns, index + indexOffset),
              ...generateStandardFields(prefix, propertyName, property)
            }
          }
        }
        break;
      case "number":
      case "integer":
        acc[key] = {
          type: "NumberField",
          props: {
            position: columnPositioner(numColumns, index + indexOffset),
            ...generateStandardFields(prefix, propertyName, property)
          }
        }
        break;
      case "array":

        const numColumnsInArrayField = ((property?.items as SchemaObject)?.type === "object")
          ? Object.keys((property?.items as SchemaObject)?.properties ?? {}).length
          : 1

        const items = ((property?.items as SchemaObject)?.type === "object")
          ? property.items!
          : { properties: { ['']: property.items! } }

        acc[key] = {
          type: "ArrayField",
          props: {
            position: columnPositioner(numColumns, index + indexOffset),
            scaffoldFields: parseSchemaObjectToFormDefinition(items, numColumnsInArrayField),
            allowAdd: true,
            allowRemove: true,
            columns: equalColumns(numColumnsInArrayField, true),
            ...generateStandardFields(prefix, propertyName, property),
          }
        }
        break;
      default:

        // console.log(property.type, property)
        break;
    }
    return acc;
  }


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
      } else {
        return parseField(acc, key, propertyName, property, index)
      }

    }, {} as ScaffoldFieldsType)
}
