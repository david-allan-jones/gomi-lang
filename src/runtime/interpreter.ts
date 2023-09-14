import { IntVal, ObjectVal, RuntimeVal } from './types'
import { BinaryExpr, BooleanLiteral, Identifier, NumericLiteral, ObjectLiteral, Program, Stmt, TernaryExpr, UnaryExpr, VarAssignment, VarDeclaration } from '../frontend/ast'
import Scope from './scope'
import { eval_binary_expr, eval_ternary_expr, eval_identifier, eval_assignment_expr, eval_unary_expr, eval_object_expr } from './eval/expressions'
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
        case "UnaryExpr":
            return eval_unary_expr(ast as UnaryExpr, scope)
        case "BinaryExpr":
            return eval_binary_expr(ast as BinaryExpr, scope)
        case "TernaryExpr":
            return eval_ternary_expr(ast as TernaryExpr, scope)
        case "ObjectLiteral":
            return eval_object_expr(ast as  ObjectLiteral, scope)
        case "NumericLiteral":
            return {
                type: 'int',
                value: (ast as NumericLiteral).value
            } as IntVal
        case "BooleanLiteral":
            return {
                type: 'boolean',
                value: (ast as BooleanLiteral).value
            } as RuntimeVal<boolean>
        case "NilLiteral":
            return {
                type: 'object'
            } as ObjectVal

        // Error
        default:
            console.error("This AST Node has not yet been setup for interpretation:", ast)
            process.exit(1)
    }
}
