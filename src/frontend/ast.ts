export type NodeType =
    // Statements
    | "Program"
    | "VarDeclaration"

    // Expressions
    | "VarAssignment"
    | "CallExpr"
    | "MemberExpr"
    | "UnaryExpr"
    | "BinaryExpr"
    | "TernaryExpr"
    | "Identifier"
    | "NumericLiteral"
    | "StringLiteral"
    | "NilLiteral"
    | "BooleanLiteral"
    | "ObjectLiteral"
    | "Property"

export interface Stmt {
    kind: NodeType
}

export interface Program extends Stmt {
    kind: "Program"
    body: Stmt[]
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration"
    declarations: {
        identifier: string,
        value: Expr
    }[]
}

export interface VarAssignment extends Expr {
    kind: "VarAssignment"
    assignee: Expr
    value: Expr
}

export interface Expr extends Stmt {}

export interface CallExpr extends Expr {
    kind: "CallExpr",
    callee:  Expr
    args: Expr[]
}

export interface MemberExpr extends Expr {
    kind: "MemberExpr",
    object: Expr,
    prop: Expr
}

export interface UnaryExpr extends Expr {
    kind: "UnaryExpr"
    operator: NormalizedUnaryOperator
    operand: PrimaryExpr
}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr
    right: Expr
    operator: NormalizedBinaryOperator
}

export interface TernaryExpr extends Expr {
    kind: "TernaryExpr"
    left: Expr
    mid: Expr
    right: Expr
}

export interface PrimaryExpr extends Expr {}

export interface Identifier extends PrimaryExpr {
    kind: "Identifier"
    symbol: string
}

export interface NumericLiteral extends PrimaryExpr {
    kind: "NumericLiteral"
    value: bigint
}

export interface StringLiteral extends PrimaryExpr {
    kind: "StringLiteral"
    value: string
}

export interface NilLiteral extends PrimaryExpr {
    kind: "NilLiteral"
    value: null
}

export interface BooleanLiteral extends PrimaryExpr {
    kind: "BooleanLiteral"
    value: boolean
}

export interface Property extends Expr {
    kind: "Property",
    key: string,
    value?: Expr
}

export interface ObjectLiteral extends PrimaryExpr {
    kind: "ObjectLiteral"
    props: Property[]
}

export interface Property extends Expr {
    kind: "Property"
    key: string
    value?: Expr
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

export type NormalizedUnaryOperator =
    | '!'
    | '-'