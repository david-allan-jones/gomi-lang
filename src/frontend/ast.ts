import { Token, TokenVal } from "./lexer"

export type NodeType =
    // Statements
    | "Program"
    | "ModuleImport"
    | "VarDeclaration"
    | "FunctionDeclaration"
    | "IfStatement"
    | "WhileStatement"

    // Expressions
    | "VarAssignment"
    | "CallExpr"
    | "UnaryExpr"
    | "MemberExpr"
    | "UnaryExpr"
    | "BinaryExpr"
    | "TernaryExpr"
    | "Identifier"
    | "IntLiteral"
    | "FloatLiteral"
    | "StringLiteral"
    | "NilLiteral"
    | "BooleanLiteral"
    | "ArrayLiteral"
    | "ObjectLiteral"
    | "Property"

export interface Stmt {
    kind: NodeType
    line: number,
    column: number
}

export interface Program extends Stmt {
    kind: "Program"
    body: Stmt[]
}

// module './somePath.gomi' import { someIdentifier }
export interface ModuleImport extends Stmt {
    kind: "ModuleImport"
    path: string
    identifiers: string[],
    line: number,
    column: number
}

export interface Declaration {
    identifier: string
    value: Expr
}

// let n = 0;
export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration"
    declarations: Declaration[]
    mutable: boolean
}

/**
 * function addOne(n) {
 *     n + 1 
 * }
 */
export interface FunctionDeclaration extends Stmt {
    kind: "FunctionDeclaration"
    params: string[]
    name: string
    body: Stmt[]
}

/**
 * if a == b {
 *     doSomething() 
 * }
 */
export interface IfStatement extends Stmt {
    kind: "IfStatement"
    condition: Expr
    body: Stmt[]
    line: number,
    column: number
}

/**
 * while i < n {
 *     doSomethig()
 *     i = i + 1
 * }
 */
export interface WhileStatement extends Stmt {
    kind: "WhileStatement"
    condition: Expr
    body: Stmt[]
    line: number,
    column: number
}

// a = b
export interface VarAssignment extends Expr {
    kind: "VarAssignment"
    assignee: Expr
    value: Expr
}

export interface Expr extends Stmt { }

// doSomething()
export interface CallExpr extends Expr {
    kind: "CallExpr",
    callee: Expr
    args: Expr[]
}

// a.b
export interface MemberExpr extends Expr {
    kind: "MemberExpr",
    object: Expr,
    prop: Expr
    index: boolean
}

// !flag, -n
export interface UnaryExpr extends Expr {
    kind: "UnaryExpr"
    operator: NormalizedUnaryOperator
    operand: PrimaryExpr
}

// a * b
export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr
    right: Expr
    operator: NormalizedBinaryOperator
}

// a ? b : c
export interface TernaryExpr extends Expr {
    kind: "TernaryExpr"
    left: Expr
    mid: Expr
    right: Expr
}

export interface PrimaryExpr extends Expr { }

// a
export interface Identifier extends PrimaryExpr {
    kind: "Identifier"
    symbol: string
}

// 1
export interface IntLiteral extends PrimaryExpr {
    kind: "IntLiteral"
    value: bigint
}

// 1.0
export interface FloatLiteral extends PrimaryExpr {
    kind: "FloatLiteral"
    value: number
}

// 'finished'
export interface StringLiteral extends PrimaryExpr {
    kind: "StringLiteral"
    value: string
}

// nil
export interface NilLiteral extends PrimaryExpr {
    kind: "NilLiteral"
    value: null
}

// false, true
export interface BooleanLiteral extends PrimaryExpr {
    kind: "BooleanLiteral"
    value: boolean
}

// a: 1, b: 'b', c: true
export interface Property extends Expr {
    kind: "Property",
    key: string,
    value?: Expr
}

// [1, 2, 3, 4]
export interface ArrayLiteral extends PrimaryExpr {
    kind: "ArrayLiteral"
    values: Expr[]
}

// { a: 1, b: 'b' }
export interface ObjectLiteral extends PrimaryExpr {
    kind: "ObjectLiteral"
    props: Property[]
}

// Helpers
export type NormalizedBinaryOperator =
    | '||'
    | '&&'
    | '<'
    | '>'
    | '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '^'
    | '=='
    | '!='
    | '>='
    | '<='

export type NormalizedUnaryOperator =
    | '!'
    | '-'


//=================================
// Helper Factories
//=================================

export function mk_int_literal(value: bigint, line: number, column: number): IntLiteral {
    return { kind: 'IntLiteral', value, line, column }
}

export function mk_float_literal(value: number, line: number, column: number): FloatLiteral {
    return { kind: 'FloatLiteral', value, line, column }
}

export function mk_string_literal(value: string, line: number, column: number): StringLiteral {
    return { kind: 'StringLiteral', value, line, column }
}

export function mk_identifier(symbol: string, line: number, column: number): Identifier {
    return { kind: 'Identifier', symbol, line, column }
}

export function mk_nil_literal(line: number, column: number): NilLiteral {
    return { kind: 'NilLiteral', value: null, line, column }
}

export function mk_boolean_literal(value: TokenVal, line: number, column: number): BooleanLiteral {
    return {
        kind: 'BooleanLiteral',
        value: [TokenVal.EN_TRUE, TokenVal.JP_TRUE].includes(value) ? true : false,
        line,
        column,
    }
}
