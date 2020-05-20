import $RefParser from "@apidevtools/json-schema-ref-parser";
import {OpenAPIObject} from "openapi3-ts";

export const fetchSchema = async (url:string) => {
  const headers = new Headers();
  headers.set('accept', 'application/json')

  const result = await fetch(url, { headers });
  const json = await result.json();

  return await $RefParser.dereference(json) as unknown as OpenAPIObject
};
