import { normalizeInt } from '../utils/japanese'
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral, BooleanLiteral, VarDeclaration, VarAssignment } from './ast'
import { tokenize, Token, TokenType, TokenVal, identifierAllowed, BinaryOperator } from './lexer'

export default class Parser {
    private tokens: Token[] = []
    private i: number = 0

    public produceAST(source: string): Program {
        this.tokens = tokenize(source)
        this.i = 0
        const program: Program = {
            kind: "Program",
            body: []
        }

        while (this.tokens[this.i].type !== TokenType.EOF) {
            program.body.push(this.parse_stmt())
        }

        return program
    }
    
    private consumeToken(): Token {
        const token = this.tokens[this.i]
        this.i = this.i + 1
        return token
    }

    private consumeTokenValidate(type: TokenType, context?: string): Token {
        const prev = this.consumeToken()
        if (!prev || prev.type !== type) {
            console.error(`Parser Error. Expected: ${type}. Received: ${prev.type}`)
            if (context !== undefined) {
                console.error(context)
            }
            process.exit(1)
        }
        return prev
    }

    private parse_stmt(): Stmt {
        switch (this.tokens[this.i].type) {
            case TokenType.Let:
                return this.parse_var_declaration()
            default:
                return this.parse_expr()
        }
    }

    private parse_var_declaration(): VarDeclaration {
        // Consume the let keyword
        this.consumeToken()

        const symbol = this.consumeTokenValidate(
            TokenType.Identifier,
            'Expected identifier following declaration keyword'
        ).value
        this.consumeTokenValidate(
            TokenType.Equals,
            'Expected equals sign following identifier in variable declaration'
        )
        return {
            kind: 'VarDeclaration',
            symbol,
            value: this.parse_expr()
        }
    }

    private parse_expr(): Expr {
        return this.parse_var_assignment()
    }

    private parse_var_assignment(): Expr {
        const left = this.parse_comparison_expr()
        if (this.tokens[this.i].type === TokenType.Equals) {
            this.consumeToken()
            const value = this.parse_var_assignment()
            return {
                kind: 'VarAssignment',
                assignee: left,
                value,
            } as VarAssignment
        }
        return left
    }

    private parse_comparison_expr(): Expr {
        let left = this.parse_additive_expr()
        while (['<', '>', '＜', '＞'].includes(this.tokens[this.i].value)) {
            let operator = this.consumeToken().value as BinaryOperator
            operator = (operator === '>' || operator === '＞') ? '>' : '<'

            const right = this.parse_additive_expr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parse_additive_expr(): Expr {
        let left = this.parse_multiplication_expr()
        while (['+', '-', '＋'].includes(this.tokens[this.i].value)) {
            let operator = this.consumeToken().value as BinaryOperator
            operator = (operator === '-') ? '-' : '+'

            const right = this.parse_multiplication_expr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parse_multiplication_expr(): Expr {
        let left = this.parse_exponential_expr()
        while (['*', '/', '%', '＊', '／', '％'].includes(this.tokens[this.i].value)) {
            let operator = this.consumeToken().value as BinaryOperator
            if (operator === '*' || operator === '＊') {
                operator = '*'
            }
            else if (operator === '/' || operator === '／') {
                operator = '/'
            }
            else {
                operator = '%'
            }

            const right = this.parse_exponential_expr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parse_exponential_expr(): Expr {
        let left = this.parse_primary_expr()
        while (['^', '＾'].includes(this.tokens[this.i].value)) {
            const operator = this.consumeToken().value
            const right = this.parse_exponential_expr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator: '^'
            } as BinaryExpr
        }
        return left
    }

    private parse_primary_expr(): Expr {
        const token = this.consumeToken()
        switch (token.type) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: token.value
                } as Identifier
            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: normalizeInt(token.value)
                } as NumericLiteral
            case TokenType.Null:
                return {
                    kind: "NullLiteral",
                    value: null
                } as NullLiteral
            case TokenType.Boolean:
                return {
                    kind: "BooleanLiteral",
                    value: [TokenVal.EN_TRUE, TokenVal.JP_TRUE].includes(token.value as TokenVal) ? true : false
                } as BooleanLiteral
            case TokenType.OpenParen:
                const expr =  this.parse_expr()
                this.consumeTokenValidate(TokenType.CloseParen)
                return expr
            default:
                console.error(`Unexpected token found during parsing: ${JSON.stringify(token)}`)
                return {} as Expr
        }
    }
}