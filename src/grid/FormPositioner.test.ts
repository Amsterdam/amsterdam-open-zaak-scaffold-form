// @ts-nocheck

import {FormPositioner, FormPositionerProps} from "./FormPositioner";

describe("FormPositioner", () => {

  const form:FormPositionerProps = {
    "field1": {
      type: "TextField",
      props: { name: "field1", autoFocus: true }
    },
    "field2": {
      type: "TextField",
      props: { name: "field1" }
    },
    "field3": {
      type: "TextField",
      props: { name: "field1" }
    },
    "field4": {
      type: "TextField",
      props: { name: "field1" }
    }
  }

  it("should set position based on a given grid", () => {
      const fields = new FormPositioner(form)
        .setGrid('mobileS', [
          ["field1", "field1"],
          ["field2", "field4"],
          ["field3", "field4"]
        ])
        .getFields()


      expect(fields.field1.props.position.mobileS?.row).toEqual(0)
      expect(fields.field1.props.position.mobileS?.column).toEqual(0)
      expect(fields.field1.props.position.mobileS?.columnSpan).toEqual(2)

      expect(fields.field2.props.position.mobileS?.column).toEqual(0)
      expect(fields.field2.props.position.mobileS?.row).toEqual(1)

      expect(fields.field3.props.position.mobileS?.column).toEqual(0)
      expect(fields.field3.props.position.mobileS?.row).toEqual(2)

      expect(fields.field4.props.position.mobileS?.column).toEqual(1)
      expect(fields.field4.props.position.mobileS?.row).toEqual(1)
      expect(fields.field4.props.position.mobileS?.rowSpan).toEqual(2)
  })

  it("should set position horizontally", () => {
    const fields = new FormPositioner(form)
      .setHorizontal("mobileS")
      .getFields()

    expect(fields.field1.props.position.mobileS?.row).toEqual(0)
    expect(fields.field1.props.position.mobileS?.column).toEqual(0)

    expect(fields.field2.props.position.mobileS?.row).toEqual(0)
    expect(fields.field2.props.position.mobileS?.column).toEqual(1)

    expect(fields.field3.props.position.mobileS?.row).toEqual(0)
    expect(fields.field3.props.position.mobileS?.column).toEqual(2)

    expect(fields.field4.props.position.mobileS?.row).toEqual(0)
    expect(fields.field4.props.position.mobileS?.column).toEqual(3)
  })

  it("should set position vertically", () => {
    const fields = new FormPositioner(form)
      .setVertical("mobileS")
      .getFields()

    expect(fields.field1.props.position.mobileS?.row).toEqual(0)
    expect(fields.field1.props.position.mobileS?.column).toEqual(0)

    expect(fields.field2.props.position.mobileS?.row).toEqual(1)
    expect(fields.field2.props.position.mobileS?.column).toEqual(0)

    expect(fields.field3.props.position.mobileS?.row).toEqual(2)
    expect(fields.field3.props.position.mobileS?.column).toEqual(0)

    expect(fields.field4.props.position.mobileS?.row).toEqual(3)
    expect(fields.field4.props.position.mobileS?.column).toEqual(0)
  })

  it("should set multiple positions", () => {
    const fields = new FormPositioner(form)
      .setVertical("mobileS")
      .setHorizontal("laptop")
      .getFields()

    expect(fields.field1.props.position.mobileS).toBeDefined()
    expect(fields.field1.props.position.laptop).toBeDefined()

    expect(fields.field2.props.position.mobileS).toBeDefined()
    expect(fields.field2.props.position.laptop).toBeDefined()

    expect(fields.field3.props.position.mobileS).toBeDefined()
    expect(fields.field3.props.position.laptop).toBeDefined()

    expect(fields.field4.props.position.mobileS).toBeDefined()
    expect(fields.field4.props.position.laptop).toBeDefined()
  })
})
