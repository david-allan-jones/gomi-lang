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
    n: RuntimeVal<number>,
    m: RuntimeVal<number>,
    op: BinaryOperator
): RuntimeVal<number | boolean> {
    switch (op) {
        case '+':
            return { type: 'number', value: n.value + m.value }
        case '-':
            return { type: 'number', value: n.value - m.value }
        case '*':
            return { type: 'number', value: n.value * m.value }
        case '/':
            // TODO: Decide how to handle divide 0
            return { type: 'number', value: n.value / m.value }
        case '%':
            // TODO: Decide how to handle mod 0
            return { type: 'number', value: n.value % m.value }
        case '^':
            return { type: 'number', value: Math.pow(n.value, m.value) }
        case '>':
            return { type: 'boolean', value: n.value > m.value }
        case '<':
            return { type: 'boolean', value: n.value < m.value }
        default:
            console.error(`Runtime Error: An unexpected operator was received by the interpreter: '${op}'`)
            process.exit(1)
    }
}

export function evalBinaryExpr(expr: BinaryExpr, scope: Scope): RuntimeVal<unknown> {
    const left = evaluate(expr.left, scope)
    const right = evaluate(expr.right, scope)
    if (left.type === 'number' && right.type === 'number') {
        return evalNumericBinaryExpr(
            left as RuntimeVal<number>,
            right as RuntimeVal<number>,
            expr.operator
        )
    }
    return { type: 'null', value: 'null' } as RuntimeVal<'null'>
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