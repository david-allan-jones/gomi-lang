import { Program, VarDeclaration as VarDeclarations } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope"
import { RuntimeVal } from "../types"

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