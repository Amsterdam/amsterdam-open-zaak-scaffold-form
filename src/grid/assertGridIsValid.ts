import {Grid} from "./Grid";
import _difference from "lodash/difference";


/**
 * Makes sure all values in the grid have a rectangular shape.
 * We don't support Tetris types.
 */
export const assertGridIsValid = <T>(availableKeys:T[], grid:Grid<T>) => {

  const distinctValues = grid.getDistinctValues()

  // Check if all `availableKeys` have a place in the given grid
  if (distinctValues.length < availableKeys.length) {
    throw new Error(`Not all given fields are present in the grid. Please add these fields ${_difference(distinctValues, availableKeys).map(_ => `"${_}"`).join(", ")}`)
  }

  // We don't support tetris-shaped values:
  // E.g:
  // [
  //  [1,1,1],
  //  [0,1,0]
  // ]
  distinctValues.forEach((value:T) => {

    if (!availableKeys.includes(value)) {
      throw new Error(`${value} is not an existing field. Existing fields are ${availableKeys.map(_ => `"${_}"`).join(", ")}.`)
    }

    const coordinates = grid.getCoordinatesForValue(value)
    const subGrid = grid.sliceArea(coordinates.topLeft, coordinates.bottomRight)

    const subGridDistinctValues = subGrid.getDistinctValues()
    if (subGridDistinctValues.length !== 1 || subGridDistinctValues[0] !== value) {
      throw new Error(`Grid contains an unsupported shape. Please make sure "${value}" has a rectangular shape.`)
    }
  })

  return true
}
