export type ValueType = "null" | "number"

export interface RuntimeVal<T> {
    type: ValueType
    value: T
}