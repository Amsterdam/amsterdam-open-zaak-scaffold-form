import React from "react";
import {CheckboxFields, NumberField, SelectField, TextField} from "amsterdam-react-final-form"
import styled from 'styled-components'

import {arrayToObject} from "./utils/arrayToObject";

type Props = {
  prefix?:string
  schema:any
}

const Fieldset = styled.fieldset`
  border: 1px solid #eee;
  padding: 0 30px 30px 30px;  
`

export const Scaffold:React.FC<Props> = ({ prefix = "", schema }) => {
  // @ts-ignore
  const fields = Object.entries(schema?.properties ?? {})

  if (fields.length === 0) {
    return null;
  }

  return <Fieldset>
    { fields.map(([key, val]:any) => {

      const name = `${prefix}${key}`;

      switch(val.type) {
        case "integer":
          return <NumberField
            key={name}
            name={name}
            label={val.title}
            hint={val.description}
          />;
        case "boolean":
          return <CheckboxFields
            key={name}
            name={name}
            label={val.title}
            options={{ 1: 'true' }}
            hint={val.description}
          />;
        case "object":
          return <Scaffold
            key={name}
            prefix={name + "."}
            schema={val}
          />;
        case "string":
          if (val.enum) {
            return <SelectField
              key={name}
              name={name}
              label={val.title}
              options={arrayToObject(val.enum)}
              hint={val.description}
            />
          }
          return <TextField
            key={name}
            name={name}
            label={val.title}
            hint={val.description}
          />;
        case "array":
          return <Scaffold
            prefix={name + "."}
            schema={val.items}
          />
        default:
          return <TextField
            key={name}
            name={name}
            label={val.title}
            hint={val.description}
          />;
      }
    })}
  </Fieldset>
}
