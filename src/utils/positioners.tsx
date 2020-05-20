import {FormGridCellDimensions, ScaffoldFieldsType} from "amsterdam-react-final-form";
import produce from "immer";

export type BreakPoint = "mobileS" | "mobileM" | "mobileL" | "tabletS" | "tabletM" | "laptop" | "laptopM" | "laptopL" | "desktop" | "desktopL";

export type Positioner = (
  index:number
) => FormGridCellDimensions

export const columnPositioner = (numColumns:number):Positioner => (
  index:number
): FormGridCellDimensions => ({
    column: index % numColumns,
    row: Math.floor(index / numColumns)
})

export const horizontalPositioner:Positioner = (
  index:number
): FormGridCellDimensions => ({
  column: index,
  row: 0
})

export const position = (fields:ScaffoldFieldsType, positions:{[key in BreakPoint]?: Positioner}) =>
  Object
    .entries(fields)
    .reduce(produce((draft, [key, val], index) => {

      Object
        .entries(positions)
        .forEach(([breakPoint, positioner]) => {
          val.props.position[breakPoint] = positioner!(index)
        })

      draft[key] = val;
    }), {})
