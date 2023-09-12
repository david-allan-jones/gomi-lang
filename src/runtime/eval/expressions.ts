import { BinaryExpr, Identifier, NormalizedBinaryOperator, NormalizedUnaryOperator, PrimaryExpr, TernaryExpr, UnaryExpr, VarAssignment } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope"
import { RuntimeVal } from "../types"

export function eval_identifier(identifier: Identifier, scope: Scope): RuntimeVal<unknown> {
    const val = scope.lookupVar(identifier.symbol)
    return val
}

export function eval_unary_expr(unary: UnaryExpr, scope: Scope): RuntimeVal<unknown> {
    const value = evaluate(unary.operand, scope)
    switch (value.type) {
        case 'boolean':
            return eval_boolean_unary_expr(
                value as RuntimeVal<boolean>,
                unary.operator
            )
        case 'number':
            return eval_numeric_unary_expr(
                value as RuntimeVal<number>,
                unary.operator
            )
        default:
            throw `An unexpected type was provided in a unary expression. The type '${value.type}' is not supported.`
    }
}

export function eval_boolean_unary_expr(
    value: RuntimeVal<boolean>,
    op: NormalizedUnaryOperator
): RuntimeVal<boolean> {
    switch (op) {
        case '!':
            return { type: 'boolean', value: !value.value }
        default:
            throw `Runtime Error: An unexpected boolean unary operator was received by the interpreter: '${op}'`
    }
}

export function eval_numeric_unary_expr(
    value: RuntimeVal<number>,
    op: NormalizedUnaryOperator
): RuntimeVal<number> {
    switch (op) {
        case '-':
            return { type: 'number', value: -1 * value.value }
        default:
            throw `Runtime Error: An unexpected numeric unary operator was received by the interpreter: '${op}'`
    }
}

export function eval_numeric_binary_expr(
    left: RuntimeVal<number>,
    right: RuntimeVal<number>,
    op: NormalizedBinaryOperator
): RuntimeVal<number | boolean> {
    switch (op) {
        case '+':
            return { type: 'number', value: left.value + right.value }
        case '-':
            return { type: 'number', value: left.value - right.value }
        case '*':
            return { type: 'number', value: left.value * right.value }
        case '/':
            if (right.value === 0) {
                throw 'You can not divide by zero'
            }
            return { type: 'number', value: left.value / right.value }
        case '%':
            if (right.value === 0) {
                throw 'You can not modulo 0'
            }
            return { type: 'number', value: left.value % right.value }
        case '^':
            return { type: 'number', value: Math.pow(left.value, right.value) }
        case '>':
            return { type: 'boolean', value: left.value > right.value }
        case '<':
            return { type: 'boolean', value: left.value < right.value }
        default:
            throw `Runtime Error: An unexpected numeric operator was received by the interpreter: '${op}'`
    }
}

export function eval_boolean_binary_expr(
    left: RuntimeVal<boolean>,
    right: RuntimeVal<boolean>,
    op: NormalizedBinaryOperator
): RuntimeVal<boolean> {
    switch (op) { 
        case '||':
            return { type: 'boolean', value: left.value || right.value }
        case '&&':
            return { type: 'boolean', value: left.value && right.value }
        default:
            throw `Runtime Error: An unexpected boolean operator was received by the interpreter: '${op}'`
    }
}

export function eval_binary_expr(expr: BinaryExpr, scope: Scope): RuntimeVal<unknown> {
    const left = evaluate(expr.left, scope)
    const right = evaluate(expr.right, scope)
    if (left.type !== right.type) {
        throw `Both sides of binary expression must be the same type. Recevied: ${left.type} & ${right.type}`
    }
    
    // We know they are the same type
    switch (left.type) {
        case 'number':
            return eval_numeric_binary_expr(
                left as RuntimeVal<number>,
                right as RuntimeVal<number>,
                expr.operator
            )
        case 'boolean':
            return eval_boolean_binary_expr(
                left as RuntimeVal<boolean>,
                right as RuntimeVal<boolean>,
                expr.operator
            )
        default:
            return {
                type: 'null',
                value: null
            } as RuntimeVal<null>
    }
}

export function eval_ternary_expr(ternary: TernaryExpr, scope: Scope): RuntimeVal<unknown> {
    const left = evaluate(ternary.left, scope)
    if (left.type !== 'boolean') {
        throw 'First expression in a ternary must evaluate to a boolean value.'
    }
    return left.value
        ? evaluate(ternary.mid, scope)
        : evaluate(ternary.right, scope)
}

export function eval_assignment_expr(assignment: VarAssignment, scope: Scope): RuntimeVal<unknown> {
    if (assignment.assignee.kind !== 'Identifier') {
        throw `Invalid LHS inside assingment expr ${JSON.stringify(assignment.assignee)}`
    }
    const identifier = (assignment.assignee as Identifier).symbol

    return scope.assignVar(
        identifier,
        evaluate(assignment.value, scope)
    )
}