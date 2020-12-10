import React, {useEffect, useState} from 'react'
import {Form} from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import {UnboundSelectField} from '@amsterdam/amsterdam-react-final-form'
import styled from 'styled-components'

import {ThemeProvider, AccordionWrapper, Accordion, Spinner, Paragraph} from "@amsterdam/asc-ui"

import './App.css'
import {arrayToObject} from "./utils/arrayToObject"
import {getSchemaObjects} from "./openAPIParser/getSchemaObjects"
import {parseOpenApiSchema} from "./openAPIParser/parseOpenApiSchema"
import {fetchSchema} from "./openAPIParser/fetchSchema"

const Div = styled.div`  
  margin: 20px 20px;
`

const StyledSpinner = styled(Spinner)`
  position: absolute;
  right: 10px;
  top: 10px;
`

const apiOptions = arrayToObject([
  "https://zaken-api.vng.cloud/api/v1/schema/openapi.json",
  "https://documenten-api.vng.cloud/api/v1/schema/openapi.json",
  "https://catalogi-api.vng.cloud/api/v1/schema/openapi.json",
  "https://besluiten-api.vng.cloud/api/v1/schema/openapi.json",
  "https://autorisaties-api.vng.cloud/api/v1/schema/openapi.json",
])

function App() {

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [api, setAPI] = useState<string|undefined>(undefined)
  const [schema, setSchema] = useState<any>(undefined)
  const [result, setResult] = useState<any>(undefined)
  const [numColumns, setNumColumns] = useState(1)

  useEffect(() => {
    if (api) {
      setIsFetching(true)
      fetchSchema(api)
        .then((result) => {
          setResult(result)
          setIsFetching(false)
        })
    } else {
      setResult(null)
    }
  }, [api, setResult])


  const schemaObjects = result ? getSchemaObjects(result) : {}
  const schemaOptions = arrayToObject(Object.keys(schemaObjects))
  const openAPISchema = schemaObjects[schema]

  const formDefinition = parseOpenApiSchema(openAPISchema)
      .setVertical("mobileS", numColumns)
      .getFields()

  return <ThemeProvider>
    { isFetching && <StyledSpinner size={20} /> }
    <Div>
      <UnboundSelectField
        label='API'
        options={apiOptions}
        withEmptyOption={true}
        onChange={(e:React.ChangeEvent<HTMLSelectElement>) => {
          setAPI(e.target.value);
          setSchema(undefined);
          setResult(undefined);
          setNumColumns(1);
        }}
      />
    </Div>
    { result && (
      <>
        <Div>
          <UnboundSelectField
            label='Schema'
            options={schemaOptions}
            withEmptyOption={true}
            onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setSchema(e.target.value)}
          />
        </Div>
        <Div>
          <UnboundSelectField
          label='Number of columns'
          hint="Breakpoint is hardcoded on 'laptop' in this demo. But you can set them as you like."
          options={arrayToObject(['1','2','3','4','5','6','7','8','9','10'])}
          onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setNumColumns(parseInt(e.target.value))}
          />
        </Div>
      </>
    ) }
    { schema && (
      <Form
        mutators={{ ...arrayMutators }}
        onSubmit={(values) => console.log(values)}
        render={({values}) => (
          <form>
            <Div>
              <AccordionWrapper>
                <Accordion title="OpenAPI Schema">
                  <Paragraph>OpenAPI defines this requestBody.</Paragraph>
                  <pre>{ JSON.stringify(openAPISchema, null, 2) }</pre>
                </Accordion>
                <Accordion title="Form Schema">
                  <Paragraph>This autogenerated form-schema should be imported in your project.</Paragraph>
                  <pre>{ JSON.stringify(formDefinition, null, 2) }</pre>
                </Accordion>
                <Accordion title="Form values">
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                </Accordion>
              </AccordionWrapper>
            </Div>
          </form>
        )}
      />
    )}
  </ThemeProvider>;
}

export default App;
