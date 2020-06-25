import axios from "axios"
import $RefParser from "@apidevtools/json-schema-ref-parser";
import {OpenAPIObject} from "openapi3-ts";

export const fetchSchema = async (url:string) => {
  const headers = {'accept': 'application/json'}

  const { data } = await axios.get(url, { headers, timeout: 30000 });

  return await $RefParser.dereference(data) as unknown as OpenAPIObject
};
