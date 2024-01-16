import { FunctionDeclaration, IfStatement, ModuleImport, Program, VarDeclaration as VarDeclarations, WhileStatement } from "../../frontend/ast"
import GomiParser from "../../frontend/parser"
import { evaluate } from "../interpreter"
import Scope from "../scope/scope"
import { BooleanValue, FunctionValue, RuntimeVal, VoidVal } from "../types"
import path from 'path'


export function eval_program(program: Program, scope: Scope, filePath: string): RuntimeVal<unknown> {
    let lastResult: RuntimeVal<unknown> = { type: 'object', value: null }
    for (let i = 0; i < program.body.length; i++) {
        lastResult = evaluate(program.body[i], scope, filePath)
    }
    return lastResult
}

export function eval_module_import(moduleImport: ModuleImport, scope: Scope, filePath: string): VoidVal {

    // Read source file
    const fs = require('fs')
	const dir = path.dirname(filePath)
    const file = fs.readFileSync(`${dir}/${moduleImport.path}`)
    const src = file.toString()

	// Prepare AST
    const parser = new GomiParser()
    const program = parser.produceAST(src)

    // Execute AST in isolated scope
    const moduleScope = new Scope(scope)
    evaluate(program, moduleScope, filePath)

    // Copy over requested identifiers to current scope
    for (let i = 0; i < moduleImport.identifiers.length; i++) {
        const moduleVal = moduleScope.lookupVar(moduleImport.identifiers[i]).val
        scope.declareVar(moduleImport.identifiers[i], moduleVal, false)
    }

    return { type: 'void' } as VoidVal
}

export function eval_var_declaration(varDeclarations: VarDeclarations, scope: Scope, filePath: string): VoidVal {
    const { declarations, mutable } = varDeclarations
    for (let i = 0; i < declarations.length; i++) {
        scope.declareVar(
            declarations[i].identifier,
            evaluate(declarations[i].value, scope, filePath),
            mutable
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
    return scope.declareVar(declaration.name, fn, false)
}

export function eval_if_statement(ifStatement: IfStatement, scope: Scope, filePath: string): VoidVal {
    const { condition, body, line, column } = ifStatement
    const conditionVal = evaluate(condition, scope, filePath)
    if (conditionVal.type !== 'boolean') {
        throw `The condition in an if statement must resolve to a boolean value. Received: ${conditionVal.type} at line ${line}, column ${column}`
    }
    if (conditionVal.value) {
        const ifScope = new Scope(scope)
        for (let i = 0; i < body.length; i++) {
            evaluate(body[i], ifScope, filePath)
        }
    }
    return { type: 'void', value: null }
}

export function eval_while_statement(whileStatement: WhileStatement, scope: Scope, filePath: string): VoidVal {
    const { condition, body, line, column } = whileStatement

    let keepLooping = evaluate(condition, new Scope(scope), filePath)
    if (keepLooping.type !== 'boolean') {
        throw `The condition in a while statement must resolve to a boolean value. Received: ${keepLooping.type} at line ${line}, column ${column}`
    }
    while (keepLooping.type === 'boolean' && (keepLooping as BooleanValue).value) {
        const whileScope = new Scope(scope)
        for (let i = 0; i < body.length; i++) {
            evaluate(body[i], whileScope, filePath)
        }
        keepLooping = evaluate(condition, whileScope, filePath)
    }

    // In case somehow it gets reassigned
    if (keepLooping.type !== 'boolean') {
        throw `The condition in a while statement must resolve to a boolean value. Received: ${keepLooping.type} at line ${line}, column ${column}`
    }
    return { type: 'void', value: null }
}
