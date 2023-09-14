export type ValueType = 
    | "void"
    | "object"
    | "int"
    | "float"
    | "boolean"

export interface RuntimeVal<T> {
    type: ValueType
    value: T
}

export interface VoidValue extends RuntimeVal<null> {
    type: 'void'
    value: null
}

export interface ObjectValue extends RuntimeVal<object | null> {
    type: 'object'
    props: Map<string, RuntimeVal<unknown>>
}

export interface NumberVal extends RuntimeVal<bigint | number> {
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

export interface BooleanValue extends RuntimeVal<boolean> {
    type: 'boolean'
    value: boolean
}