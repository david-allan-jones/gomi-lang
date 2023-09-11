import { RuntimeVal } from './types'
import { BinaryExpr, Identifier, NumericLiteral, Program, Stmt, VarDeclaration } from '../frontend/ast'
import Scope from './scope'
import { evalBinaryExpr, evalIdentifier } from './eval/expressions'
import { evalProgram, evalVarDeclaration } from './eval/statements'

export function evaluate(ast: Stmt, scope: Scope): RuntimeVal<unknown> {
    switch (ast.kind) {
        // Statements
        case "Program":
            return evalProgram(ast as Program, scope)
        case "VarDeclaration":
            return evalVarDeclaration(ast as VarDeclaration, scope)

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
