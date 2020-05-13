import React, {useEffect, useState} from 'react';
import {Form} from 'react-final-form';
import {UnboundSelectField} from 'amsterdam-react-final-form';
import styled from 'styled-components';

import $RefParser from "@apidevtools/json-schema-ref-parser";
import {ThemeProvider, AccordionWrapper, Accordion, Spinner} from "@datapunt/asc-ui"

import './App.css';
import {arrayToObject} from "./utils/arrayToObject";
import {Scaffold} from "./Scaffold";

const fetchSchema = async (api:string) => {
  const result = await fetch(api);
  const json = await result.json();
  return await $RefParser.dereference(json);
};

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
  "https://autorisaties-api.vng.cloud/api/v1/schema/openapi.json"
])

function App() {

  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [api, setAPI] = useState<string|undefined>(undefined)
  const [schema, setSchema] = useState<any>(undefined)
  const [result, setResult] = useState<any>(undefined)

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

  const schemaOptions = result
    ? arrayToObject(
        Object
          // @ts-ignore
          .keys(result.components.requestBodies)
      )
    : {}

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
        }}
      />
    </Div>
    { result && (
      <Div>
        <UnboundSelectField
          label='Schema'
          options={schemaOptions}
          withEmptyOption={true}
          onChange={(e:React.ChangeEvent<HTMLSelectElement>) => setSchema(e.target.value)}
        />
      </Div>
    ) }
    { schema && (
      <Form
        onSubmit={(values) => console.log(values)}
        render={({values}) => (
          <form>
            <Div>
              <AccordionWrapper>
                <Accordion title="OpenAPI Schema">
              <pre>
                {
                  // @ts-ignore
                  JSON.stringify(result.components.schemas[schema], null, 2)
                }
              </pre>
                </Accordion>
                <Accordion title="Form values">
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                </Accordion>
                <Accordion title="Form typescript">
                  <pre>TODO: show typescript to create this form.</pre>
                </Accordion>
                <Accordion title="Scaffolded form" isOpen={true}>
                  <Scaffold
                    // @ts-ignore
                    schema={result.components.schemas[schema]}
                  />
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
