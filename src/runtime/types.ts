export type ValueType = "null" | "number" | "boolean"

export interface RuntimeVal<T> {
    type: ValueType
    value: T
}