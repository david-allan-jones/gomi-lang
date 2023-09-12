import { normalizeInt } from '../utils/japanese'
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral, BooleanLiteral, VarDeclaration, VarAssignment, TernaryExpr } from './ast'
import { tokenize, Token, TokenType, TokenVal } from './lexer'

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

        while (this.at().type !== TokenType.EOF) {
            program.body.push(this.parse_stmt())
        }

        return program
    }

    private at(): Token {
        return this.tokens[this.i]
    }

    private atType(type: TokenType): boolean {
        return this.at().type === type
    }
    
    private consumeToken(): Token {
        const token = this.at()
        this.i = this.i + 1
        return token
    }

    private consumeTokenValidate(type: TokenType, hint?: string): Token {
        const prev = this.consumeToken()
        if (!prev || prev.type !== type) {
            console.error(`ゴミ Parser Error\nExpected: '${prev.value}'\nReceived: '${prev.value}'`)
            if (hint !== undefined) {
                console.error(`Hint: ${hint}`)
            }
            process.exit(1)
        }
        return prev
    }

    private not_eof(): boolean {
        return !this.atType(TokenType.EOF)
    }

    private parse_stmt(): Stmt {
        switch (this.at().type) {
            case TokenType.Let:
                return this.parse_var_declaration()
            default:
                return this.parse_expr()
        }
    }

    private parse_var_declaration(): VarDeclaration {
        // Consume the let keyword
        this.consumeToken()

        const identifiers = []
        const values = []

        // Consume identifer by identifier
        while (this.not_eof() && !this.atType(TokenType.Equals)) {
            const identifier = this.consumeTokenValidate(
                TokenType.Identifier,
                'Identifiers must be separated by comma in assignment'
            ).value
            identifiers.push(identifier)
            if (this.atType(TokenType.Comma)) {
                this.consumeToken()
            }
        }

        this.consumeTokenValidate(
            TokenType.Equals,
            'Expected equals sign following identifier in variable declaration'
        )

        // Consume expression by expression
        while (this.not_eof() && !this.atType(TokenType.Semicolon)) {
            values.push(this.parse_expr())
            if (this.atType(TokenType.Comma)) {
                this.consumeToken()
            }
        }

        if (this.not_eof()) {
            this.consumeTokenValidate(TokenType.Semicolon, 'Declaration error. Please end it with a semicolon.')
        }

        if (identifiers.length !== values.length) {
            throw `Declaration error. Number of identifiers and expressions did not match.`
        }

        const declarations: { identifier: string, value: Expr }[] = []
        for (let i = 0; i < identifiers.length; i++) {
            declarations.push({
                identifier: identifiers[i],
                value: values[i]
            })
        }

        return {
            kind: 'VarDeclaration',
            declarations,
        }
    }

    private parse_expr(): Expr {
        return this.parse_assign_expr()
    }

    private parse_assign_expr(): Expr {
        const left = this.parse_ternary_expr()
        if (this.at().type === TokenType.Equals) {
            this.consumeToken()
            const value = this.parse_assign_expr()
            return {
                kind: 'VarAssignment',
                assignee: left,
                value,
            } as VarAssignment
        }
        return left
    }

    private parse_ternary_expr(): Expr {
        let left = this.parse_logical_or_expr()
        if (this.atType(TokenType.Question)) {
            this.consumeToken()
            const mid = this.parse_ternary_expr()
            this.consumeTokenValidate(TokenType.Colon, 'Invalid character detected in ternary expression')
            const right = this.parse_ternary_expr()
            return {
                kind: 'TernaryExpr',
                left,
                mid,
                right
            } as TernaryExpr
        }
        return left
    }

    private parse_logical_or_expr(): Expr {
        let left = this.parse_logical_and_expr()
        while (['||', '｜｜'].includes(this.at().value)) {
            this.consumeToken().value
            const right = this.parse_logical_and_expr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator: '||'
            } as BinaryExpr
        }
        return left
    }

    private parse_logical_and_expr(): Expr {
        let left = this.parse_comparison_expr()
        while (['&&', '＆＆'].includes(this.at().value)) {
            this.consumeToken().value
            const right = this.parse_comparison_expr()
            left = {
                kind: 'BinaryExpr',
                left,
                right,
                operator: '&&'
            } as BinaryExpr
        }
        return left
    }

    private parse_comparison_expr(): Expr {
        let left = this.parse_additive_expr()
        while (['<', '>', '＜', '＞'].includes(this.at().value)) {
            let operator = this.consumeToken().value
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
        while (['+', '-', '＋'].includes(this.at().value)) {
            let operator = this.consumeToken().value
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
        while (['*', '/', '%', '＊', '／', '％'].includes(this.at().value)) {
            let operator = this.consumeToken().value
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
        while (['^', '＾'].includes(this.at().value)) {
            this.consumeToken()
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
                throw `Unexpected token found during parsing: ${JSON.stringify(token)}`
        }
    }
}