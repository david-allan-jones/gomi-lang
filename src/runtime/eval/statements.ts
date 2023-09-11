import { Program, VarDeclaration } from "../../ast"
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

export function evalVarDeclaration(varDelcaration: VarDeclaration, scope: Scope): RuntimeVal<unknown> {
    return scope.declareVar(
        varDelcaration.symbol,
        evaluate(varDelcaration.value, scope)
    )
}