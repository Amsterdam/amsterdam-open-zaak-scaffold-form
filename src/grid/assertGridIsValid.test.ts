import {Grid} from "./Grid";
import {assertGridIsValid} from "./assertGridIsValid";

describe("isGridValid", () => {
  const availableKeys = ["one", "two", "three", "four"]

  describe("when given a valid grid", () => {

    const grid = new Grid([
      ["one",    "two",    "two"],
      ["three",  "two",     "two"],
      ["four",    "four",   "four"],
    ])

    it("should return true", () => {
        expect(assertGridIsValid(availableKeys, grid)).toEqual(true)
    })
  })

  describe("when given an empty grid", () => {
    // Two is not rectangular shaped:
    const grid = new Grid([])

    it("should throw an error", () => {
      expect(() => assertGridIsValid(availableKeys, grid)).toThrowError(expect.anything())
    })
  })


  describe("when not given all available fields", () => {
    // Two is not rectangular shaped:
    const grid = new Grid([
      ["one",    "two",    "three"],
    ])

    it("should throw an error", () => {
      expect(() => assertGridIsValid(availableKeys, grid)).toThrowError(expect.anything())
    })
  })

  describe("when given a tetris shaped area in the grid", () => {

    // Two is not rectangular shaped:
    const grid = new Grid([
      ["one",    "two",    "two"],
      ["three",  "two",    "five"],
      ["four",   "four",   "four"],
    ])

    it("should throw an error", () => {
      expect(() => assertGridIsValid(availableKeys, grid)).toThrowError(expect.anything())
    })
  })

  describe("when given an unknown key", () => {

    // Two is not rectangular shaped:
    const grid = new Grid([
      ["one_unknown",    "two",    "two"],
      ["three",  "two",     "two"],
      ["four",    "four",   "four"],
    ])

    it("should throw an error", () => {
      expect(() => assertGridIsValid(availableKeys, grid)).toThrowError(expect.anything())
    })
  })
})
