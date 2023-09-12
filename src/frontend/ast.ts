export type NodeType =
    // Statements
    | "Program"
    | "VarDeclaration"
    | "VarAssignment"

    // Expressions
    | "BinaryExpr"
    | "TernaryExpr"
    | "Identifier"
    | "NumericLiteral"
    | "NullLiteral"
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

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral"
    props: Map<string, Property>
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