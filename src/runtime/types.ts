export type ValueType = 
    | "void"
    | "null"
    | "int"
    | "float"
    | "boolean"

export interface RuntimeVal<T> {
    type: ValueType
    value: T
}

export interface NumberVal {
    type: 'int' | 'float'
    value: bigint | number
}

export interface IntVal extends NumberVal {
    type: 'int'
    value: bigint
}

export interface FloatVal extends NumberVal {
    type: 'float'
    value: number
}