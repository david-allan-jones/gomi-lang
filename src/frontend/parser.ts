import { normalizeInt } from '../utils/japanese'
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NullLiteral, BooleanLiteral, VarDeclaration, VarAssignment, TernaryExpr, UnaryExpr } from './ast'
import GomiTokenizer, { Token, TokenType as TT, TokenVal } from './tokenizer'

export default class GomiParser {
    private tokenizer: GomiTokenizer = new GomiTokenizer('')
    private at: Token = { type: TT.Null, value: 'nil' }

    public produceAST(source: string): Program {
        this.tokenizer = new GomiTokenizer(source)
        return this.parse_program()
    }

    private parse_program(): Program {
        const program: Program = {
            kind: "Program",
            body: []
        }
        this.at = this.tokenizer.read_token()
        while (this.at.type !== TT.EOF) {
            program.body.push(this.parse_stmt())
        }
        return program
    }

    private eat_token(): void {
        this.at = this.tokenizer.read_token()
    }

    private validate_token(type: TT, hint?: string): void {
        if (!this.at || this.at.type !== type) {
            console.error(`ゴミ Parser Error\nExpected: '${this.at.value}'\nReceived: '${this.at.value}'`)
            if (hint !== undefined) {
                console.error(`Hint: ${hint}`)
            }
            process.exit(1)
        }
    }

    private not_eof(): boolean {
        return this.at.type !== TT.EOF
    }

    private parse_stmt(): Stmt {
        switch (this.at.type) {
            case TT.Let:
                return this.parse_var_declaration()
            default:
                return this.parse_expr()
        }
    }

    private parse_var_declaration(): VarDeclaration {
        // Consume the let keyword
        this.eat_token()

        const identifiers = []
        const values = []

        // Consume identifer by identifier
        while (this.not_eof() && this.at.type !== TT.Equals) {
            this.validate_token(
                TT.Identifier,
                'Identifiers must be separated by comma in assignment'
            )
            identifiers.push(this.at.value)
            this.eat_token()

            if (this.at.type === TT.Comma) {
                this.eat_token()
            }
        }

        this.validate_token(
            TT.Equals,
            'Expected equals sign following identifier in variable declaration'
        )
        this.eat_token()

        // Consume expression by expression
        while (this.not_eof() && this.at.type !== TT.Semicolon) {
            values.push(this.parse_expr())
            if (this.at.type === TT.Comma) {
                this.eat_token()
            }
        }

        if (this.not_eof()) {
            this.validate_token(TT.Semicolon, 'Declaration error. Please end it with a semicolon.')
            this.eat_token()
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
        if (this.at.type === TT.Equals) {
            this.eat_token()
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
        if (this.at.type === TT.Question) {
            this.eat_token()
            const mid = this.parse_ternary_expr()
            this.validate_token(TT.Colon, 'Invalid character detected in ternary expression')
            this.eat_token()
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
        while (['||', '｜｜'].includes(this.at.value)) {
            this.eat_token()
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
        while (['&&', '＆＆'].includes(this.at.value)) {
            this.eat_token()
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
        while (['<', '>', '＜', '＞'].includes(this.at.value)) {
            let operator = this.at.value
            this.eat_token()
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
        while (['+', '-', '＋'].includes(this.at.value)) {
            let operator = this.at.value
            this.eat_token()
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
        while (['*', '/', '%', '＊', '／', '％'].includes(this.at.value)) {
            let operator = this.at.value
            this.eat_token()
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
        let left = this.parse_unary_expr()
        while (['^', '＾'].includes(this.at.value)) {
            this.eat_token()
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

    private parse_unary_expr(): Expr {
        if (this.at.type === TT.Bang) {
            return this.parse_bang_expr()
        }
        if (this.at.value === '-') {
            return this.parse_negative_expr()
        }
        return this.parse_primary_expr()
    }

    private parse_bang_expr(): Expr {
        // Consume the bang
        this.eat_token()
        const operand = this.parse_primary_expr()
        return {
            kind: 'UnaryExpr',
            operator: '!',
            operand
        } as UnaryExpr
    }

    private parse_negative_expr(): Expr {
        // Consume the negative sign
        this.eat_token()
        const operand = this.parse_primary_expr()
        return {
            kind: 'UnaryExpr',
            operator: '-',
            operand
        } as UnaryExpr
    }

    private parse_primary_expr(): Expr {
        const prev = this.at
        this.eat_token()
        switch (prev.type) {
            case TT.Identifier:
                return {
                    kind: "Identifier",
                    symbol: prev.value
                } as Identifier
            case TT.Number:
                return {
                    kind: "NumericLiteral",
                    value: normalizeInt(prev.value)
                } as NumericLiteral
            case TT.Null:
                return {
                    kind: "NullLiteral",
                    value: null
                } as NullLiteral
            case TT.Boolean:
                return {
                    kind: "BooleanLiteral",
                    value: [TokenVal.EN_TRUE, TokenVal.JP_TRUE].includes(prev.value as TokenVal) ? true : false
                } as BooleanLiteral
            case TT.OpenParen:
                const expr =  this.parse_expr()
                this.validate_token(TT.CloseParen)
                this.eat_token()
                return expr
            default:
                throw `Unexpected token found during parsing: '${prev.value}'`
        }
    }
}