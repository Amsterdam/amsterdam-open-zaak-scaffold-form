import React from "react"
import {TextField, BooleanField, NumberField, SelectField} from "amsterdam-react-final-form";
import {FormFields} from "./parseToFormDefinition";

export const formDefinitionToTs = (formDefinition:FormFields) => Object
  .entries(formDefinition)
  .map(([key, val]) => {
    switch (val._type) {
      case "integer":
      case "number":
        return `<NumberField {...formDefinition.${key}} />`
      case "boolean":
        return `<BooleanField {...formDefinition.${key}} />`
      default:
        return val.options
          ? `<SelectField {...formDefinition.${key}} />`
          : `<TextField {...formDefinition.${key}} />`
    }
  })
  .join("\n")

type Props = {
  formDefinition:FormFields
}

export const Scaffold:React.FC<Props> = ({formDefinition}) => (<>
  {
    Object
      .entries(formDefinition)
      .map(([key, val]) => {
        switch (val._type) {
          case "integer":
          case "number":
            return <NumberField key={key} {...formDefinition[key]} />
          case "boolean":
            return <BooleanField key={key} {...formDefinition[key]} />
          default:
            return val.options !== undefined
              // @ts-ignore
              ? <SelectField key={key} {...formDefinition[key]} />
              : <TextField key={key} {...formDefinition[key]} />
        }
      })
  }
</>)


