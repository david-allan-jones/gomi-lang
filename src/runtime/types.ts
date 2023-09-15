import Scope from "./scope/scope"

export type ValueType = 
    | "void"
    | "object"
    | "int"
    | "float"
    | "string"
    | "boolean"
    | "function"

export interface RuntimeVal<T> {
    type: ValueType
    value?: T
}

export interface VoidVal extends RuntimeVal<null> {
    type: 'void'
    value: null
}

export interface ObjectVal extends RuntimeVal<object | null> {
    type: 'object'
    value?: Map<string, RuntimeVal<unknown>>
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

export interface StringVal extends RuntimeVal<string> {
    type: 'string'
    value: string
}

export interface BooleanValue extends RuntimeVal<boolean> {
    type: 'boolean'
    value: boolean
}

export type FunctionCall = (
    args: RuntimeVal<unknown>[],
    scope: Scope
) => RuntimeVal<unknown>

export interface FunctionValue extends RuntimeVal<unknown> {
    type: "function"
    call: FunctionCall
}

export function mk_function(call: FunctionCall): FunctionValue {
    return { type: 'function', call }
}