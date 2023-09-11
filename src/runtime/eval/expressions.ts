import { BinaryExpr, Identifier, VarAssignment } from "../../frontend/ast"
import { BinaryOperator } from "../../frontend/lexer"
import { evaluate } from "../interpreter"
import Scope from "../scope"
import { RuntimeVal } from "../types"

export function evalIdentifier(identifier: Identifier, scope: Scope): RuntimeVal<unknown> {
    const val = scope.lookupVar(identifier.symbol)
    return val
}

export function evalNumericBinaryExpr(
    left: RuntimeVal<number>,
    right: RuntimeVal<number>,
    op: BinaryOperator
): RuntimeVal<number | boolean> {
    switch (op) {
        case '+':
            return { type: 'number', value: left.value + right.value }
        case '-':
            return { type: 'number', value: left.value - right.value }
        case '*':
            return { type: 'number', value: left.value * right.value }
        case '/':
            // TODO: Decide how to handle divide 0
            return { type: 'number', value: left.value / right.value }
        case '%':
            // TODO: Decide how to handle mod 0
            return { type: 'number', value: left.value % right.value }
        case '^':
            return { type: 'number', value: Math.pow(left.value, right.value) }
        case '>':
            return { type: 'boolean', value: left.value > right.value }
        case '<':
            return { type: 'boolean', value: left.value < right.value }
        default:
            console.error(`Runtime Error: An unexpected numeric operator was received by the interpreter: '${op}'`)
            process.exit(1)
    }
}

export function evalBooleanBinaryExpr(
    left: RuntimeVal<boolean>,
    right: RuntimeVal<boolean>,
    op: string
): RuntimeVal<boolean> {
    switch (op) {
        default:
            console.error(`Runtime Error: An unexpected boolean operator was received by the interpreter: '${op}'`)
            process.exit(1)
    }
}

export function evalBinaryExpr(expr: BinaryExpr, scope: Scope): RuntimeVal<unknown> {
    const left = evaluate(expr.left, scope)
    const right = evaluate(expr.right, scope)
    if (left.type !== right.type) {
        throw `Both sides of binary expression must be the same type. Recevied: ${left.type} & ${right.type}`
    }
    
    // We know they are the same type
    switch (left.type) {
        case 'number':
            return evalNumericBinaryExpr(
                left as RuntimeVal<number>,
                right as RuntimeVal<number>,
                expr.operator
            )
        case 'boolean':
            return evalBooleanBinaryExpr(
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

export function evalAssignmentExpr(assignment: VarAssignment, scope: Scope): RuntimeVal<unknown> {
    if (assignment.assignee.kind !== 'Identifier') {
        throw `Invalid LHS inside assingment expr ${JSON.stringify(assignment.assignee)}`
    }
    const identifier = (assignment.assignee as Identifier).symbol

    return scope.assignVar(
        identifier,
        evaluate(assignment.value, scope)
    )
}