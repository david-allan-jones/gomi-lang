import { RuntimeVal } from './types'
import { BinaryExpr, BooleanLiteral, Identifier, NumericLiteral, Program, Stmt, VarAssignment, VarDeclaration } from '../frontend/ast'
import Scope from './scope'
import { evalBinaryExpr, evalIdentifier, evalAssignmentExpr } from './eval/expressions'
import { evalProgram, evalVarDeclaration } from './eval/statements'

export function evaluate(ast: Stmt, scope: Scope): RuntimeVal<unknown> {
    switch (ast.kind) {
        // Statements
        case "Program":
            return evalProgram(ast as Program, scope)
        case "VarDeclaration":
            return evalVarDeclaration(ast as VarDeclaration, scope)
        case "VarAssignment":
            return evalAssignmentExpr(ast as VarAssignment, scope)

        // Expressions
        case "Identifier":
            return evalIdentifier(ast as Identifier, scope)
        case "BinaryExpr":
            return evalBinaryExpr(ast as BinaryExpr, scope)
        case "NumericLiteral":
            return {
                type: 'number',
                value: (ast as NumericLiteral).value
            } as RuntimeVal<number>
        case "BooleanLiteral":
            return {
                type: 'boolean',
                value: (ast as BooleanLiteral).value
            } as RuntimeVal<boolean>
        case "NullLiteral":
            return {
                value: null,
                type: 'null'
            } as RuntimeVal<null>

        // Error
        default:
            console.error("This AST Node has not yet been setup for interpretation:", ast)
            process.exit(1)
    }
}
