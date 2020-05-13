import {arrayToObject} from "./arrayToObject";

type Definition = {
  type: string
  properties: Record<string, Definition | FieldDefinition>
}

type FieldDefinition = {
  type: string,
  title: string,
  description: string,
  enum?: string[]
}

export type FormField = {
  name: string
  hint: string
  label: string
  options?: Record<string, string>
  _type: string
}

export type FormFields = Record<string, FormField>

const isDefinition = (obj:any): obj is Definition => obj.type === 'object'

const generateKey = (prefix: string, key: string) =>
  (prefix + key).replace(/\./g, '_')

const generateFormField = (prefix: string, key: string, field:FieldDefinition, keepType:boolean = false) => ({
    name: prefix + key,
    hint: field.description,
    label: field.title,
    _type: field.type,
    options: field.enum && arrayToObject(field.enum),
})

export const parseToFormDefinition = (object:Definition, prefix:string =  ""):FormFields =>
    Object
      .entries(object.properties ?? {})
      .reduce(
        (acc, [key, val]) =>
          isDefinition(val)
            ? { ...acc, ...parseToFormDefinition(val, key + ".") }
            : { ...acc, [generateKey(prefix, key)]:  generateFormField(prefix, key, val) },
        {}
      )
