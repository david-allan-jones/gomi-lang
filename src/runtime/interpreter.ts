import { RuntimeVal } from './types'
import { BinaryExpr, NumericLiteral, Program, Stmt } from '../ast'
import { BinaryOperator } from '../lexer'

function evalProgram(program: Program): RuntimeVal<unknown> {
    let lastResult: RuntimeVal<unknown> = { type: 'null', value: 'null' }
    for (let i = 0; i < program.body.length; i++) {
        lastResult = evaluate(program.body[i])
    }
    return lastResult
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

function evalBinaryExpr(expr: BinaryExpr): RuntimeVal<unknown> {
    const left = evaluate(expr.left)
    const right = evaluate(expr.right)
    if (left.type === 'number' && right.type === 'number') {
        return evalNumericBinaryExpr(
            left as RuntimeVal<number>,
            right as RuntimeVal<number>,
            expr.operator
        )
    }
    return { type: 'null', value: 'null' } as RuntimeVal<'null'>
}

export function evaluate(ast: Stmt): RuntimeVal<unknown> {
    switch (ast.kind) {
        case "Program":
            return evalProgram(ast as Program)
        case "BinaryExpr":
            return evalBinaryExpr(ast as BinaryExpr)
        case "NumericLiteral":
            return {
                type: 'number',
                value: (ast as NumericLiteral).value
            } as RuntimeVal<number>
        case "NullLiteral":
            return {
                value: 'null',
                type: 'null'
            } as RuntimeVal<'null'>
        default:
            console.error("This AST Node has not yet been setup for interpretation:", ast)
            process.exit(1)
    }
}
