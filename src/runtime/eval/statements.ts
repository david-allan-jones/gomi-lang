import { Program, VarDeclaration } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope"
import { RuntimeVal } from "../types"

export function evalProgram(program: Program, scope: Scope): RuntimeVal<unknown> {
    let lastResult: RuntimeVal<unknown> = { type: 'null', value: 'null' }
    for (let i = 0; i < program.body.length; i++) {
        lastResult = evaluate(program.body[i], scope)
    }
    return lastResult
}

export function evalVarDeclaration(declaration: VarDeclaration, scope: Scope): RuntimeVal<unknown> {
    return scope.declareVar(
        declaration.symbol,
        evaluate(declaration.value, scope)
    )
}