import { env } from "process"
import { FunctionDeclaration, Program, VarDeclaration as VarDeclarations } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope/scope"
import { FunctionValue, RuntimeVal } from "../types"

export function eval_program(program: Program, scope: Scope): RuntimeVal<unknown> {
    let lastResult: RuntimeVal<unknown> = { type: 'object', value: null }
    for (let i = 0; i < program.body.length; i++) {
        lastResult = evaluate(program.body[i], scope)
    }
    return lastResult
}

export function eval_var_declaration(varDeclarations: VarDeclarations, scope: Scope): RuntimeVal<null> {
    const { declarations } = varDeclarations
    for (let i = 0; i < declarations.length; i++) {
        scope.declareVar(
            declarations[i].identifier,
            evaluate(declarations[i].value, scope)
        )
    }
    return { type: 'void', value: null }
}

export function eval_function_declaration(declaration: FunctionDeclaration, scope: Scope): RuntimeVal<unknown> {
    const fn =  {
        type: "function",
        name: declaration.name,
        parameters: declaration.params,
        declarationScope: scope,
        body: declaration.body
    } as FunctionValue
    return scope.declareVar(declaration.name, fn)
}