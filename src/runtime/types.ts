import { Stmt } from "../frontend/ast"
import Scope from "./scope/scope"

export type ValueType = 
    | "void"
    | "object"
    | "array"
    | "int"
    | "float"
    | "string"
    | "boolean"
    | "native-function"
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

export interface ArrayVal extends RuntimeVal<unknown[]> {
    type: 'array'
    value: RuntimeVal<unknown>[]
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

export interface NativeFunctionValue extends RuntimeVal<unknown> {
    type: "native-function"
    call: FunctionCall
}

export interface FunctionValue extends RuntimeVal<unknown> {
    type: "function"
    name: string
    parameters: string[]
    declarationScope: Scope
    body: Stmt[]
}

export function mk_native_function(call: FunctionCall): NativeFunctionValue {
    return { type: 'native-function', call }
}