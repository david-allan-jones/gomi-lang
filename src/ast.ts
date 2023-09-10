export type NodeType =
    | "Program"
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

export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
    kind: "BinaryExpr"
    left: Expr
    right: Expr
    operator: string
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
    value: "無"
}

export interface BooleanLiteral extends Expr {
    kind: "BooleanLiteral"
    value: boolean
}