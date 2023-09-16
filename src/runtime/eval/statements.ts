import { FunctionDeclaration, IfStatement, Program, VarDeclaration as VarDeclarations, WhileStatement } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope/scope"
import { BooleanValue, FunctionValue, RuntimeVal, VoidVal } from "../types"

export function eval_program(program: Program, scope: Scope): RuntimeVal<unknown> {
    let lastResult: RuntimeVal<unknown> = { type: 'object', value: null }
    for (let i = 0; i < program.body.length; i++) {
        lastResult = evaluate(program.body[i], scope)
    }
    return lastResult
}

export function eval_var_declaration(varDeclarations: VarDeclarations, scope: Scope): VoidVal {
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

export function eval_if_statement(ifStatement: IfStatement, scope: Scope): VoidVal {
    const { condition, body } = ifStatement
    const conditionVal = evaluate(condition, scope)
    if (conditionVal.type !== 'boolean') {
        throw `The condition in an if statement must resolve to a boolean value. Received: ${conditionVal.type}`
    }
    if (conditionVal.value) {
        const ifScope = new Scope(scope)
        for (let i = 0; i < body.length; i++) {
            evaluate(body[i], ifScope)
        }
    }
    return { type: 'void', value: null }
}

export function eval_while_statement(whileStatement: WhileStatement, scope: Scope): VoidVal {
    const { condition, body } = whileStatement

    const whileScope = new Scope(scope)
    let keepLooping = evaluate(condition, whileScope)
    if (keepLooping.type !== 'boolean') {
        throw `The condition in a while statement must resolve to a boolean value. Received: ${keepLooping.type}`
    }
    while (keepLooping.type === 'boolean' && (keepLooping as BooleanValue).value) {
        console.log('hit')
        for (let i = 0; i < body.length; i++) {
            evaluate(body[i], whileScope)
        }
        keepLooping = evaluate(condition, whileScope)
    }

    if (keepLooping.type !== 'boolean') {
        throw `The condition in a while statement must resolve to a boolean value. Received: ${keepLooping.type}`
    }
    return { type: 'void', value: null }
}