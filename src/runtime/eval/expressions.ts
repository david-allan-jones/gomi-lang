import exp from "constants"
import { BinaryExpr, Identifier, NormalizedBinaryOperator, NormalizedUnaryOperator, NilLiteral, ObjectLiteral, PrimaryExpr, TernaryExpr, UnaryExpr, VarAssignment, CallExpr, MemberExpr } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope/scope"
import { BooleanValue, FloatVal, NativeFunctionValue, IntVal, NumberVal, ObjectVal, RuntimeVal, StringVal, FunctionValue, VoidVal } from "../types"

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
            throw `Runtime Error: An unexpected int operator was received by the interpreter: '${op}'`
    }
}

export function eval_float_binary_expr(
    left: FloatVal,
    right: FloatVal,
    op: NormalizedBinaryOperator
): RuntimeVal<number | boolean> {
    switch (op) {
        case '+':
            return { type: 'int', value: left.value + right.value }
        case '-':
            return { type: 'int', value: left.value - right.value }
        case '*':
            return { type: 'int', value: left.value * right.value }
        case '/':
            if (right.value === 0) {
                throw 'You can not divide by zero'
            }
            return { type: 'int', value: left.value / right.value }
        case '^':
            return { type: 'int', value: left.value ** right.value }
        case '>':
            return { type: 'boolean', value: left.value > right.value }
        case '<':
            return { type: 'boolean', value: left.value < right.value }
        default:
            throw `Runtime Error: An unexpected float operator was received by the interpreter: '${op}'`
    }
}

export function eval_boolean_binary_expr(
    left: BooleanValue,
    right: BooleanValue,
    op: NormalizedBinaryOperator
): BooleanValue {
    switch (op) { 
        case '||':
            return { type: 'boolean', value: left.value || right.value }
        case '&&':
            return { type: 'boolean', value: left.value && right.value }
        default:
            throw `Runtime Error: An unexpected boolean operator was received by the interpreter: '${op}'`
    }
}

export function eval_string_binary_expr(
    left: StringVal,
    right: StringVal,
    op: NormalizedBinaryOperator
): StringVal {
    switch (op) {
        case '+':
            return { type: 'string', value: left.value + right.value }
        case '-':
            return { type: 'string', value: left.value.replace(right.value, '') }
        case '*':
            return { type: 'string', value: `${right.value}${left.value}${right.value}`}
        case '/':
            return { type: 'string', value: left.value.replaceAll(right.value, '') }
        default:
            throw `Runtime Error: An unexpected string operator was received by the interpreter: '${op}'`
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
        case 'string':
            return eval_string_binary_expr(
                left as StringVal,
                right as StringVal,
                expr.operator
            )
        case 'boolean':
            return eval_boolean_binary_expr(
                left as BooleanValue,
                right as BooleanValue,
                expr.operator
            )
        default:
            throw `No binary expression evaluation has been defined for type '${left.type}'`
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

    const oldValue = scope.lookupVar(identifier) as RuntimeVal<unknown>
    const newValue = evaluate(assignment.value, scope)
    if (oldValue.type !== newValue.type) {
        throw `Mismatched assignment. Both sides of the = must be the same type. Received '${oldValue.type}' and '${newValue.type}'.`
    }
    return scope.assignVar(
        identifier,
        evaluate(assignment.value, scope)
    )
}

export function eval_object_expr(obj: ObjectLiteral | NilLiteral, scope: Scope): ObjectVal {
    if (obj.kind === 'NilLiteral') {
        return { type: "object" }
    }
    const object: ObjectVal =  { type: "object", value: new Map() }
    for (const { key, value } of obj.props) {
        const runtimeVal = (value === undefined) 
            ? scope.lookupVar(key)
            : evaluate(value, scope)
        object.value?.set(key, runtimeVal)
    }
    return object
}

export function eval_member_expr(expr: MemberExpr, scope: Scope): RuntimeVal<unknown> {
    const { type, value } = evaluate(expr.object, scope) as ObjectVal
    if (type !== 'object') {
        throw `Member expressions only supported for object types. Received: ${obj.type}`
    }
    const { symbol } = expr.prop as Identifier
    if (value === undefined) {
        throw 'No value on an object'
    }
    if (value.has(symbol) === false) {
        return { type: 'object' } as ObjectVal
    }
    // @ts-ignore
    return value.get(symbol)
}

export function eval_call_expr(expr: CallExpr, scope: Scope): RuntimeVal<unknown> {
    const args = expr.args.map(a => evaluate(a, scope))
    const fn = evaluate(expr.callee, scope)
    if (fn.type === 'native-function') {
        const result = (fn as NativeFunctionValue).call(args, scope)
        return result
    }
    if (fn.type === 'function') {
        const func = fn as FunctionValue
        const funcScope = new Scope(func.declarationScope)

        //Create the variables
        for (let i = 0; i < func.parameters.length; i++) {
            funcScope.declareVar(func.parameters[i], args[i])
        }
        let result: RuntimeVal<unknown> = { type: 'void', value: null }
        for (let i = 0; i < func.body.length; i++) {
            result = evaluate(func.body[i], funcScope)
        }
        return result
    }
    throw 'Cannot call value that is not a function: ' + JSON.stringify(fn)
}