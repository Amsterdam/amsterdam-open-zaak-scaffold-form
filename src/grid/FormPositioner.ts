import produce from "immer"
import { ScaffoldAvailableFields, ScaffoldFields } from "amsterdam-react-final-form"
import _chunk from "lodash/chunk"

import {Grid} from "./Grid";
import {assertGridIsValid} from "./assertGridIsValid";

type BreakPoint = "mobileS" | "mobileM" | "mobileL" | "tabletS" | "tabletM" | "laptop" | "laptopM" | "laptopL" | "desktop" | "desktopL"

export type FormPositionerProps = Record<string, ScaffoldAvailableFields>

export class FormPositioner<T extends FormPositionerProps> {

  constructor(protected fields:T) {}

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
  public setGrid(breakPoint:BreakPoint, arrayGrid:Array<Array<keyof T>>) {
    // Wrap array grid in a Grid object.
    // It has some nice utility functions to work with.
    const grid = new Grid(arrayGrid)

    // Make sure the give grid is a valid grid:
    assertGridIsValid(Object.keys(this.fields), grid)

    // Update position attributes for the given fields:
    const fields = produce(this.fields, draftState => {

      // Loop through each distinct field:
      grid.getDistinctValues().forEach((value) => {

        const key = value as string
        const { topLeft, bottomRight } = grid.getCoordinatesForValue(key)

        // Update position:
        draftState[key].props.position = {
          // Spread current position
          ...draftState[key].props.position,
          // Update position for given breakpoint:
          [breakPoint]: {
            column: topLeft.x,
            columnSpan: bottomRight.x - topLeft.x + 1,
            row: topLeft.y,
            rowSpan: bottomRight.y - topLeft.y + 1
          }
        }
      })
    })

    // Return a new formPositioner.
    // It allows us to chain, while still being immutable.
    return new FormPositioner(fields)
  }

  /**
   * Aligns all input-fields vertically.
   */
  setVertical(breakPoint:BreakPoint, numColumns:number = 1) {
    return this.setGrid(
      breakPoint,
      _chunk(Object.keys(this.fields), numColumns)
    )
  }

  /**
   * Aligns all input-fields horizontally.
   */
  setHorizontal(breakPoint:BreakPoint) {
    return this.setGrid(
      breakPoint,
      [Object.keys(this.fields)]
    )
  }

  getFields = ():ScaffoldFields => {
    return this.fields as ScaffoldFields
  }

}
