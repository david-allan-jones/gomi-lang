import { BinaryOperator } from "./lexer"

export type NodeType =
    // Statements
    | "Program"
    | "VarDeclaration"
    | "VarAssignment"

    // Expressions
    | "NumericLiteral"
    | "NullLiteral"
    | "BooleanLiteral"
    | "Identifier"
    | "BinaryExpr"

export interface Stmt {
    kind: NodeType
}

export interface Program extends Stmt {
    kind: "Program"
    body: Stmt[]
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration"
    symbol: string
    value: Expr
}

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr
    right: Expr
    operator: BinaryOperator
}

export interface Identifier extends Expr {
    kind: "Identifier"
    symbol: string
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral"
    value: number
}

export interface NullLiteral extends Expr {
    kind: "NullLiteral"
    value: null
}

export interface BooleanLiteral extends Expr {
    kind: "BooleanLiteral"
    value: boolean
}

export interface VarAssignment extends Expr {
    kind: "VarAssignment"
    assignee: Expr
    value: Expr
}