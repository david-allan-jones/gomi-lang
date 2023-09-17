import { BinaryExpr, Identifier, NormalizedBinaryOperator, NormalizedUnaryOperator, NilLiteral, ObjectLiteral, PrimaryExpr, TernaryExpr, UnaryExpr, VarAssignment, CallExpr, MemberExpr, ArrayLiteral } from "../../frontend/ast"
import { evaluate } from "../interpreter"
import Scope from "../scope/scope"
import { BooleanValue, FloatVal, NativeFunctionValue, IntVal, NumberVal, ObjectVal as ArrayVal, RuntimeVal, StringVal, FunctionValue, VoidVal, ArrayVal } from "../types"

export function eval_identifier(identifier: Identifier, scope: Scope): RuntimeVal<unknown> {
    return scope.lookupVar(identifier.symbol).val
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
                value as IntVal,
                unary.operator
            )
        case 'float':
            return eval_float_unary_expr(
                value as FloatVal,
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
        case '-':
            return { type: 'float', value: -1 * value.value }
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
        case '==':
            return { type: 'boolean', value: left.value === right.value}
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
        case '==':
            return { type: 'boolean', value: left.value === right.value }
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
        case '==':
            return { type: 'boolean', value: left.value === right.value }
        default:
            throw `Runtime Error: An unexpected boolean operator was received by the interpreter: '${op}'`
    }
}

export function eval_string_binary_expr(
    left: StringVal,
    right: StringVal,
    op: NormalizedBinaryOperator
): StringVal | BooleanValue {
    switch (op) {
        case '+':
            return { type: 'string', value: left.value + right.value }
        case '-':
            return { type: 'string', value: left.value.replace(right.value, '') }
        case '*':
            return { type: 'string', value: `${right.value}${left.value}${right.value}`}
        case '/':
            return { type: 'string', value: left.value.replaceAll(right.value, '') }
        case '==':
            return { type: 'boolean', value: left.value === right.value }
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

function eval_array_index_assignment(assignment: VarAssignment, scope: Scope): RuntimeVal<unknown> {
     // Walk the tree down to base expression (identifier)
    let current = assignment.assignee
    const nestedIndices = [] // Will be in reverse order
    while (current.kind === 'MemberExpr') {
        const { value: idx } = evaluate((current as MemberExpr).prop, scope)
        nestedIndices.push(Number(idx))
        current = (current as MemberExpr).object
    }

    // Add a check for non-identifier
    if (current.kind !== 'Identifier') {
        throw `You can not do array index assingment where the root is not an identifer.`
    }

    // Lookup root object
    let { val: arr, mutable } = scope.lookupVar((current as Identifier).symbol)
    if (mutable === false) {
        throw `You attempted to assign a value to '${(current as Identifier).symbol}' but it is not mutable`
    }

    // Walk down the array using nestedProps
    let pointer = arr as ArrayVal
    for (let i = nestedIndices.length - 1; i > 0; i--) {
        // @ts-ignore
        pointer = pointer.value[nestedIndices[i]]
    }

    // Now just set the prop and save it
    const rhs = evaluate(assignment.value, scope)

    // @ts-ignore
    pointer.value[nestedIndices[0]] = rhs
    return scope.assignVar((current as Identifier).symbol, arr)
}

function eval_object_prop_assignment(assignment: VarAssignment, scope: Scope): RuntimeVal<unknown> {
    // Walk the tree down to base expression (identifier)
    let current = assignment.assignee
    const nestedProps = [] // Will be in reverse order
    while (current.kind === 'MemberExpr') {
        const prop = ((current as MemberExpr).prop as Identifier).symbol
        nestedProps.push(prop)
        current = (current as MemberExpr).object
    }

    // Add a check for non-identifier
    if (current.kind !== 'Identifier') {
        throw `You can not do object property assingment where the root is not an identifer.`
    }

    // Lookup root object
    let { val: obj, mutable } = scope.lookupVar((current as Identifier).symbol)
    if (mutable === false) {
        throw `You attempted to assign a value to '${(current as Identifier).symbol}' but it is not mutable`
    }

    // Walk down the object using nestedProps
    let pointer = obj as ArrayVal
    for (let i = nestedProps.length - 1; i > 0; i--) {
        // @ts-ignore
        pointer = pointer.value?.get(nestedProps[i])
    }

    // Now just set the prop and save it
    const rhs = evaluate(assignment.value, scope)
    pointer.value?.set(nestedProps[0], evaluate(assignment.value, scope))
    return scope.assignVar((current as Identifier).symbol, obj)
}

function eval_member_expr_assignment(assignment: VarAssignment, scope: Scope): RuntimeVal<unknown> {
    if ((assignment.assignee as MemberExpr).index) {
        return eval_array_index_assignment(assignment, scope)
    }
    return eval_object_prop_assignment(assignment, scope)
}

export function eval_assignment_expr(assignment: VarAssignment, scope: Scope): RuntimeVal<unknown> {
    if (assignment.assignee.kind === 'MemberExpr') {
        return eval_member_expr_assignment(assignment, scope)
    }

    // Not a member expression, so just act like it's just a variable
    if (assignment.assignee.kind !== 'Identifier') {
        throw `Invalid LHS inside assingment: ${assignment.assignee.kind}`
    }
    const identifier = (assignment.assignee as Identifier).symbol

    const { val, mutable } = scope.lookupVar(identifier)
    if (mutable === false) {
        throw `You attempted to assign a value to '${identifier}' but it is not mutable`
    }
    const newValue = evaluate(assignment.value, scope)
    if (val.type !== newValue.type) {
        throw `Mismatched assignment. Both sides of the = must be the same type. Received '${val.type}' and '${newValue.type}'.`
    }
    return scope.assignVar(
        identifier,
        evaluate(assignment.value, scope)
    )
}

export function eval_object_expr(obj: ObjectLiteral | NilLiteral, scope: Scope): ArrayVal {
    if (obj.kind === 'NilLiteral') {
        return { type: "object" }
    }
    const object: ArrayVal =  { type: "object", value: new Map() }
    for (const { key, value } of obj.props) {
        const runtimeVal = (value === undefined) 
            ? scope.lookupVar(key).val
            : evaluate(value, scope)
        object.value?.set(key, runtimeVal)
    }
    return object
}

export function eval_array_expr(arr: ArrayLiteral, scope: Scope): ArrayVal {
    const value: RuntimeVal<unknown>[] = []
    for (let i = 0; i < arr.values.length; i++) {
        const runtimeVal = evaluate(arr.values[i], scope)
        value.push(runtimeVal)
    }
    return { type: 'array', value }
}

export function eval_member_expr(expr: MemberExpr, scope: Scope): RuntimeVal<unknown> {
    if (expr.index) {
        return eval_index_expr(expr, scope)
    }
    const { type, value } = evaluate(expr.object, scope) as ArrayVal
    if (type !== 'object') {
        throw `Member expressions only supported for object types. Received: ${type}`
    }
    const { symbol } = expr.prop as Identifier
    if (value === undefined) {
        throw 'No value on an object'
    }
    if (value.has(symbol) === false) {
        return { type: 'object' } as ArrayVal
    }
    // @ts-ignore
    return value.get(symbol)
}

export function eval_index_expr(expr: MemberExpr, scope: Scope): RuntimeVal<unknown> {
    const { type, value } = evaluate(expr.object, scope) as ArrayVal
    if (type !== 'array') {
        throw `Array index expressions only supported for array types. Received: ${type}`
    }
    const index = evaluate(expr.prop, scope) as IntVal
    if (index.type !== 'int') {
        throw `Indexing expressions must evaluate to an int. Received: ${index.type}`
    }
    const result = value[Number(index.value)]
    if (result === undefined) {
        throw `Attempted to access an invalid index. The max index of the array is ${value.length - 1} but you accessed ${index.value}`
    }
    return result
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
        if (func.parameters.length !== expr.args.length) {
            throw `The call expression for ${func.name} has an invalid number of args. Expected ${func.parameters.length} but received ${expr.args.length}`
        }
        const funcScope = new Scope(func.declarationScope)

        //Create the variables
        for (let i = 0; i < func.parameters.length; i++) {
            funcScope.declareVar(func.parameters[i], args[i], true)
        }
        let result: RuntimeVal<unknown> = { type: 'void', value: null }
        for (let i = 0; i < func.body.length; i++) {
            result = evaluate(func.body[i], funcScope)
        }
        return result
    }
    throw 'Cannot call value that is not a function: ' + JSON.stringify(fn)
}