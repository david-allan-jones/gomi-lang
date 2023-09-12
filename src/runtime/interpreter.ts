import { RuntimeVal } from './types'
import { BinaryExpr, BooleanLiteral, Identifier, NumericLiteral, Program, Stmt, VarAssignment, VarDeclaration } from '../frontend/ast'
import Scope from './scope'
import { eval_binary_expr, eval_identifier, eval_assignment_expr } from './eval/expressions'
import { eval_program, eval_var_declaration } from './eval/statements'

export function evaluate(ast: Stmt, scope: Scope): RuntimeVal<unknown> {
    switch (ast.kind) {
        // Statements
        case "Program":
            return eval_program(ast as Program, scope)
        case "VarDeclaration":
            return eval_var_declaration(ast as VarDeclaration, scope)
        case "VarAssignment":
            return eval_assignment_expr(ast as VarAssignment, scope)

        // Expressions
        case "Identifier":
            return eval_identifier(ast as Identifier, scope)
        case "BinaryExpr":
            return eval_binary_expr(ast as BinaryExpr, scope)
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
