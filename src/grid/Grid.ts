type Coordinate = {
  x:number,
  y: number
}

/**
 * Two dimensional array grid.
 * Useful to position elements with.
 *
 * Example:
 *
 * new Grid([
 *  [1,2,3],
 *  [4,5,6],
 *  [7,8,9]
 * ])
 *
 */
export class Grid<T> {

  constructor(protected grid:Array<Array<T>>) {}

  getValues() {
    return this.grid
  }

  /**
   * Returns an array of distinct values in this grid
   */
  getDistinctValues():T[] {
    const values:T[] = []

    this.grid.forEach((row) => {
      row.forEach((item) => {
        if (!values.includes(item)) {
          values.push(item)
        }
      })
    })

    return values
  }

  sliceArea(topLeft:Coordinate, bottomRight:Coordinate):Grid<T> {
    if (topLeft.x > bottomRight.x || topLeft.y > bottomRight.y) {
      throw new Error("Coordinates are mixed up. Please ensure topLeft is actually in the top-left corner. And bottomRight is actually in the bottom-right corner")
    }

    return new Grid(
      this.grid
        .slice(topLeft.y, bottomRight.y + 1)
        .map(row => row.slice(topLeft.x, bottomRight.x + 1))
    )
  }

  getCoordinatesForValue(value:T) {
    const x:number[] = [];
    const y:number[] = [];

    this.grid.forEach((row, yIndex) => {
      row.forEach((item, xIndex) => {
        if (item === value) {
          x.push(xIndex)
          y.push(yIndex)
        }
      })
    })

    return {
      topLeft: { x: Math.min(...x), y: Math.min(...y)  },
      bottomRight: { x: Math.max(...x), y: Math.max(...y)  }
    }
  }
}
