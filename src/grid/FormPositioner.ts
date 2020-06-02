import produce from "immer"
import {Dimensions, Responsive, BreakPoint} from "amsterdam-react-final-form"
import _chunk from "lodash/chunk"

import {Grid} from "./Grid";
import {assertGridIsValid} from "./assertGridIsValid";
import {equalColumns} from "../utils/equalColumns";
import {isResponsiveDimensions} from "../utils/isResponsive";
import {OnlyResponsive} from "amsterdam-react-final-form/components/layout/responsiveProps";

// Fields given to the positioner should at least implement the following type:
type OptionalPosition = { props: { position?: Responsive<Dimensions> } }
// Transforms `OptionalPosition` to make `position` required
type RequiredPosition<T extends OptionalPosition> = T & { props: T["props"] & { position: OnlyResponsive<Dimensions> } }
// A record of fields:
export type FormPositionerFields<T extends OptionalPosition> = Record<string, T>

export class FormPositioner<T extends OptionalPosition> {

  constructor(
    protected fields: FormPositionerFields<T>,
    protected columns:Responsive<string> = {}
  ) {}

  /**
   * Position form elements responsively in a grid.
   * Example usage:
   *
   *
   * .setGrid("laptop", [                               // Breakpoint from laptop to bigger
   *    ["title",   "title",        "title"],           // NOTE: title has a colspan of 3
   *    ["street",  "number",       "city"],
   *    ["code",    "description",  "description"],     // NOTE: description has a colspan of 2, and a rowspan of 2
   *    ["status",  "description",  "description"]
   * ])
   * .setVertical("mobileS", 1)                         // NOTE: align everything in a single column for mobileS until laptop
   *
   */
  public setGrid(breakPoint:BreakPoint, columns: string, arrayGrid:Array<Array<keyof FormPositionerFields<T>>>) {

    // We save the columns setting in a different prop.
    if (typeof this.columns === "object") {
      this.columns[breakPoint] = columns
    }

    // Wrap array grid in a Grid object.
    // It has some nice utility functions to work with.
    const grid = new Grid(arrayGrid)

    // Make sure the given grid is a valid grid:
    assertGridIsValid(Object.keys(this.fields), grid)

    // Update position attributes for the given fields:
    const fields = produce(this.fields, draftState => {
      Object
        .keys(this.fields)
        .forEach(key => {
          const fieldProps = draftState[key].props
          const { topLeft, bottomRight } = grid.getCoordinatesForValue(key)

          if (fieldProps.position === undefined) {
            fieldProps.position = {}
          }

          if (!isResponsiveDimensions(fieldProps.position)) {
            // When there already was a position set, but it wasn't marked responsive,
            // We set that value to the lowest breakpoint:
            fieldProps.position = { mobileS: fieldProps.position }
          }

          // Set values to breakpoint.
          fieldProps.position[breakPoint] = {
            column: topLeft.x,
            columnSpan: bottomRight.x - topLeft.x + 1,
            row: topLeft.y,
            rowSpan: bottomRight.y - topLeft.y + 1
          }
        })
    })

    // Return a new formPositioner.
    // It allows us to chain, while still being immutable.
    return new FormPositioner(
      fields as FormPositionerFields<RequiredPosition<T>>,  // Fields now all have a position. Mark them as 'required'. Scaffold-components need them marked as required.
      this.columns
    )
  }

  /**
   * Aligns all input-fields vertically.
   */
  setVertical(breakPoint:BreakPoint, numColumns:number = 1, columns?:string) {
    return this.setGrid(
      breakPoint,
      columns ?? equalColumns(numColumns, false),
      _chunk(Object.keys(this.fields), numColumns)
    )
  }

  /**
   * Aligns all input-fields horizontally.
   */
  setHorizontal(breakPoint:BreakPoint, columns?:string) {
    const keys = Object.keys(this.fields)
    return this.setGrid(
      breakPoint,
      columns ?? equalColumns(keys.length, false),
      [keys]
    )
  }

  getColumns() {
    return this.columns
  }

  getFields() {
    return this.fields
  }

  getScaffoldProps() {
    return {
      fields: this.fields,
      columns: this.columns
    }
  }

}
