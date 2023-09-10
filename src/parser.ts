import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier } from './ast'
import { tokenize, Token, TokenType } from './lexer'

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
            program.body.push(this.parseStmt())
        }

        return program
    }
    
    private nextToken(): Token {
        const token = this.tokens[this.i]
        this.i = this.i + 1
        return token
    }

    private parseStmt(): Stmt {
        return this.parseExpr()
    }

    private parseExpr(): Expr {
        return this.parseAdditiveExpr()
    }

    private parseAdditiveExpr(): Expr {
        let left = this.parseMultiplicativeExpr()
        while (this.tokens[this.i].value === '+' || this.tokens[this.i].value === '-') {
            const operator = this.nextToken().value
            const right = this.parseMultiplicativeExpr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parseMultiplicativeExpr(): Expr {
        let left = this.parsePrimaryExpr()
        while (this.tokens[this.i].value === '*' || this.tokens[this.i].value === '/') {
            const operator = this.nextToken().value
            const right = this.parsePrimaryExpr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator
            } as BinaryExpr
        }
        return left
    }

    private parsePrimaryExpr(): Expr {
        const token = this.nextToken()
        switch (token.type) {
            case TokenType.Identifier:
                return {
                    kind: "Identifier",
                    symbol: token.value
                } as Identifier
            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(token.value)
                } as NumericLiteral
            default:
                console.error(`Unexpected token found during parsing: ${JSON.stringify(token)}`)
                return {} as Expr
        }
    }
}