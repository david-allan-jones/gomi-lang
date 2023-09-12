export type ValueType = "void" | "null" | "number" | "boolean"

export interface RuntimeVal<T> {
    type: ValueType
    value: T
}