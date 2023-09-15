import { normalizeInt } from '../utils/japanese'
import { Stmt, Program, Expr, BinaryExpr, NumericLiteral, Identifier, NilLiteral, BooleanLiteral, VarDeclaration, VarAssignment, TernaryExpr, UnaryExpr, Property, ObjectLiteral, StringLiteral, CallExpr, MemberExpr, FunctionDeclaration } from './ast'
import GomiLexer, { Token, TokenType as TT, TokenVal, TokenType } from './lexer'

export default class GomiParser {
    private tokenizer: GomiLexer = new GomiLexer('')
    private at: Token = { type: TT.Nil, value: 'nil', line: 1, column: 1 }

    public produceAST(source: string): Program {
        this.tokenizer = new GomiLexer(source)
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
            case TT.Function:
                return this.parse_function_declaration()
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

    private parse_function_declaration(): FunctionDeclaration {
        // Eat the function keyword
        this.eat_token()
        
        // Get the name
        this.validate_token(TT.Identifier, 'Function name must be an identifier')
        const name = this.at.value
        this.eat_token()

        // Parse the arguments and verify identifiers
        const args = this.parse_args()
        const params: string[] = []
        for (let i = 0; i < args.length; i++) {
            if (args[i].kind !== 'Identifier') {
                throw `Expected identifiers inside function parameteres. Received ${args[i]}`
            }
            params.push((args[i] as Identifier).symbol)
        }

        this.validate_token(TT.OpenBrace, 'Function declarations must be enclosed in braces')
        this.eat_token()

        // Get function body
        const body: Stmt[] = []
        while (this.not_eof() && this.at.type !== TT.CloseBrace) {
            body.push(this.parse_stmt())
        }

        this.validate_token(TT.CloseBrace, 'Function declarations must be enclosed in braces')
        this.eat_token()

        return {
            kind: 'FunctionDeclaration',
            name,
            params,
            body
        } as FunctionDeclaration
    }

    private parse_expr(): Expr {
        return this.parse_assign_expr()
    }

    private parse_assign_expr(): Expr {
        const left = this.parse_object_expr()
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

    private parse_object_expr(): Expr {
        if (this.at.type !== TT.OpenBrace) {
            return this.parse_ternary_expr()
        }

        this.eat_token()
        const props: Property[] = []
        // @ts-ignore
        while (this.not_eof() && this.at.type !== TT.CloseBrace) {
            this.validate_token(TT.Identifier, 'Object literal key expected')
            const key = this.at.value
            this.eat_token()

            // @ts-ignore
            if (this.at.type === TT.Comma) {
                this.eat_token()
                props.push({ key, kind: 'Property' })
                continue
            // @ts-ignore
            } else if (this.at.type === TT.CloseBrace) {
                props.push({ key, kind: 'Property' })
                continue
            }

            this.validate_token(TT.Colon, 'Colon expected in object literal')
            this.eat_token()
            const value = this.parse_expr()
            props.push({ kind: 'Property', value, key })
            // @ts-ignore
            if (this.at.type !== TokenType.CloseBrace) {
                this.validate_token(TT.Comma, 'Expected comma following object literal property')
                this.eat_token()
            }
        }
        this.validate_token(TT.CloseBrace, 'Missing closing brace in object literal.')
        this.eat_token()
        return { kind: 'ObjectLiteral', props } as ObjectLiteral
    }

    private parse_ternary_expr(): Expr {
        let left = this.parse_logical_or_expr()
        if (this.at.type === TT.Question) {
            this.eat_token()
            const mid = this.parse_object_expr()
            this.validate_token(TT.Colon, 'Invalid character detected in ternary expression')
            this.eat_token()
            const right = this.parse_object_expr()
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
        return this.parse_call_member_expr()
    }

    private parse_bang_expr(): Expr {
        // Consume the bang
        this.eat_token()
        const operand = this.parse_call_member_expr()
        return {
            kind: 'UnaryExpr',
            operator: '!',
            operand
        } as UnaryExpr
    }

    private parse_negative_expr(): Expr {
        // Consume the negative sign
        this.eat_token()
        const operand = this.parse_call_member_expr()
        return {
            kind: 'UnaryExpr',
            operator: '-',
            operand
        } as UnaryExpr
    }

    private parse_call_member_expr(): Expr {
        const member = this.parse_member_expr()
        if (this.at.type === TT.OpenParen) {
            return this.parse_call_expr(member)
        }
        return member
    }

    private parse_call_expr(callee: Expr): CallExpr {
        let callExpr: CallExpr = {
            kind: 'CallExpr',
            callee,
            args: this.parse_args()
        } 
        if (this.at.type === TT.OpenParen) {
            callExpr = this.parse_call_expr(callExpr)
        }
        return callExpr
    }

    private parse_args(): Expr[] {
        this.validate_token(TT.OpenParen, 'Expected open paren')  
        this.eat_token()
        const args = this.at.type === TT.CloseParen
            ? []
            : this.parse_arg_lit()

        this.validate_token(TT.CloseParen, 'Missing closing paren in call expression')
        this.eat_token()
        return args
    }

    private parse_arg_lit(): Expr[] {
        const args = [this.parse_expr()]
        while (this.not_eof() && this.at.type === TT.Comma) {
            this.eat_token()
            args.push(this.parse_expr())
        }
        return args
    }

    private parse_member_expr(): Expr {
        let object = this.parse_primary_expr()
        while (this.at.type === TT.Period) {
            this.eat_token()
            let prop = this.parse_primary_expr()
            if (prop.kind !== 'Identifier') {
                throw 'Cannot access props on an object that are not identifiers'
            }
            object = {
                kind: 'MemberExpr',
                object,
                prop
            } as MemberExpr
        }
        return object
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
            case TT.Int:
                return {
                    kind: "NumericLiteral",
                    value: normalizeInt(prev.value)
                } as NumericLiteral
            case TT.String:
                return {
                    kind: "StringLiteral",
                    value: prev.value
                } as StringLiteral
            case TT.Nil:
                return {
                    kind: "NilLiteral",
                    value: null
                } as NilLiteral
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