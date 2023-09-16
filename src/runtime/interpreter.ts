import { IntVal, ObjectVal, RuntimeVal, StringVal } from './types'
import { ArrayLiteral, BinaryExpr, BooleanLiteral, CallExpr, FunctionDeclaration, Identifier, IfStatement, MemberExpr, ModuleImport, NumericLiteral, ObjectLiteral, Program, Stmt, StringLiteral, TernaryExpr, UnaryExpr, VarAssignment, VarDeclaration, WhileStatement } from '../frontend/ast'
import Scope from './scope/scope'
import { eval_binary_expr, eval_ternary_expr, eval_identifier, eval_assignment_expr, eval_unary_expr, eval_object_expr, eval_call_expr, eval_member_expr, eval_array_expr } from './eval/expressions'
import { eval_function_declaration, eval_if_statement, eval_module_import, eval_program, eval_var_declaration, eval_while_statement } from './eval/statements'

export function evaluate(ast: Stmt, scope: Scope): RuntimeVal<unknown> {
    switch (ast.kind) {
        // Statements
        case "Program":
            return eval_program(ast as Program, scope)
        case "ModuleImport":
            return eval_module_import(ast as ModuleImport, scope)
        case "VarDeclaration":
            return eval_var_declaration(ast as VarDeclaration, scope)
        case "FunctionDeclaration":
            return eval_function_declaration(ast as FunctionDeclaration, scope)
        case "IfStatement":
            return eval_if_statement(ast as IfStatement, scope)
        case "WhileStatement":
            return eval_while_statement(ast as WhileStatement, scope)

        // Expressions
        case "VarAssignment":
            return eval_assignment_expr(ast as VarAssignment, scope)
        case "Identifier":
            return eval_identifier(ast as Identifier, scope)
        case "UnaryExpr":
            return eval_unary_expr(ast as UnaryExpr, scope)
        case "BinaryExpr":
            return eval_binary_expr(ast as BinaryExpr, scope)
        case "TernaryExpr":
            return eval_ternary_expr(ast as TernaryExpr, scope)
        case "ObjectLiteral":
            return eval_object_expr(ast as ObjectLiteral, scope)
        case "ArrayLiteral":
            return eval_array_expr(ast as ArrayLiteral, scope)
        case "MemberExpr":
            return eval_member_expr(ast as MemberExpr, scope)
        case "CallExpr":
            return eval_call_expr(ast as CallExpr, scope)
        case "NumericLiteral":
            return {
                type: 'int',
                value: (ast as NumericLiteral).value
            } as IntVal
        case "StringLiteral":
            return {
                type: 'string',
                value: (ast as StringLiteral).value
            } as StringVal
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
