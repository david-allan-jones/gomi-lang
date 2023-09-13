import { BinaryExpr, Identifier, NormalizedBinaryOperator, NormalizedUnaryOperator, PrimaryExpr, TernaryExpr, UnaryExpr, VarAssignment } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope"
import { FloatVal, IntVal, NumberVal, RuntimeVal } from "../types"

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
        case 'int':
            return eval_numeric_unary_expr(
                value as NumberVal,
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
    value: NumberVal,
    op: NormalizedUnaryOperator
): NumberVal {
    switch (value.type) {
        case 'int':
            return eval_int_unary_expr(value as IntVal, op)
        case 'float':
            return eval_float_unary_expr(value as FloatVal, op)
        default:
            throw `Runtime Error: An unexpected unary operator numeric type was received by the interpreter: '${value.type}'`
    }
}

function eval_int_unary_expr(
    value: IntVal,
    op: NormalizedUnaryOperator
): IntVal {
    switch (op) {
        case '-':
            return { type: 'int', value: -1n * value.value }
        default:
            throw `Runtime Error: An unexpected numeric unary operator was received by the interpreter: '${op}'`
    }
}

function eval_float_unary_expr(
    value: FloatVal,
    op: NormalizedUnaryOperator
): FloatVal {
    switch (op) {
        default:
            throw `Runtime Error: An unexpected numeric unary operator was received by the interpreter: '${op}'`
    }
}

export function eval_int_binary_expr(
    left: IntVal,
    right: IntVal,
    op: NormalizedBinaryOperator
): RuntimeVal<bigint | boolean> {
    switch (op) {
        case '+':
            return { type: 'int', value: left.value + right.value }
        case '-':
            return { type: 'int', value: left.value - right.value }
        case '*':
            return { type: 'int', value: left.value * right.value }
        case '/':
            if (right.value === 0n) {
                throw 'You can not divide by zero'
            }
            return { type: 'int', value: left.value / right.value }
        case '%':
            if (right.value === 0n) {
                throw 'You can not modulo 0'
            }
            return { type: 'int', value: left.value % right.value }
        case '^':
            return { type: 'int', value: left.value ** right.value }
        case '>':
            return { type: 'boolean', value: left.value > right.value }
        case '<':
            return { type: 'boolean', value: left.value < right.value }
        default:
            throw `Runtime Error: An unexpected numeric operator was received by the interpreter: '${op}'`
    }
}

export function eval_float_binary_expr(
    left: FloatVal,
    right: FloatVal,
    op: NormalizedBinaryOperator
): RuntimeVal<number | boolean> {
    switch (op) {
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
        case 'int':
            return eval_int_binary_expr(
                left as IntVal,
                right as IntVal,
                expr.operator
            )
        case 'float':
            return eval_float_binary_expr(
                left as FloatVal,
                right as FloatVal,
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
                type: 'nil',
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