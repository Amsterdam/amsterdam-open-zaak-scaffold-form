import { Grid } from "./Grid";

describe("Grid", () => {

  const grid = new Grid([
    ["one",    "two",    "two"],
    ["three",  "two",    "two"],
    ["four",   "four",   "four"],
  ])

  it("should return all distinct values", () => {
     expect(grid.getDistinctValues())
       .toEqual(["one", "two", "three", "four"])
  })

  it("should slice a new grid based on given coordinates", () => {
    const twos = grid.sliceArea({x: 1, y: 0}, {x: 2, y: 1})
    expect(twos.getValues()).toEqual([
      ["two", "two"],
      ["two", "two"],
    ])

    const fours = grid.sliceArea({x: 0, y: 2}, {x: 2, y: 2})
    expect(fours.getValues()).toEqual([
      ["four",   "four",   "four"],
    ])

    const slicedArea = grid.sliceArea({x: 0, y: 1}, {x: 1, y: 2})
    expect(slicedArea.getValues()).toEqual([
      ["three",  "two"],
      ["four",   "four"],
    ])
  })

  it("get coordinates for values", () => {
    expect(grid.getCoordinatesForValue("one"))
      .toEqual({ topLeft: {x: 0, y: 0}, bottomRight: {x: 0, y: 0}})

    expect(grid.getCoordinatesForValue("two"))
      .toEqual({ topLeft: {x: 1, y: 0}, bottomRight: {x: 2, y: 1}})

    expect(grid.getCoordinatesForValue("three"))
      .toEqual({ topLeft: {x: 0, y: 1}, bottomRight: {x: 0, y: 1}})

    expect(grid.getCoordinatesForValue("four"))
      .toEqual({ topLeft: {x: 0, y: 2}, bottomRight: {x: 2, y: 2}})
  })
})
