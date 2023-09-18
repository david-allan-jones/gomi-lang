import { describe, expect, it } from "bun:test";
import { evaluate } from "./interpreter";
import { ArrayLiteral, BooleanLiteral, Expr, MemberExpr, NilLiteral, IntLiteral, ObjectLiteral, StringLiteral, VarAssignment, VarDeclaration, mk_identifier, mk_int_literal, mk_float_literal, Stmt, NodeType } from "../frontend/ast";
import Scope from "./scope/scope";
import { fail } from "assert";
import { ArrayVal, IntVal, ObjectVal, VoidVal } from "./types";
import GomiParser from "../frontend/parser";

describe('Gomi Interpreter', () => {
    const runProgram = (src: string, scope: Scope) => {
        const parser = new GomiParser()
        const program = parser.produceAST(src)
        return evaluate(program, scope)
    }

    it('int literal', () => {
        const result = runProgram('1', new Scope())
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
    })

    it('float literal', () => {
        const result = runProgram('1.0', new Scope())
        expect(result.type).toBe('float')
        expect(result.value).toBe(1)
    })

    it('boolean literals', () => {
        const result = runProgram('true', new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(true)
    })

    it('string literals', () => {
        const result = runProgram("'abc'", new Scope())
        expect(result.type).toBe('string')
        expect(result.value).toBe('abc')
    })

    it('nil literals', () => {
        const result = runProgram('nil', new Scope())
        expect(result.type).toBe('object')
        expect(result.value).toBe(undefined)
    })

    it('array literals', () => {
        const result = runProgram('[1, 2]', new Scope())
        expect(result.type).toBe('array')
        const [val1, val2] = result.value as IntVal[]
        expect(val1.type).toBe('int')
        expect(val1.value).toBe(1n)
        expect(val2.type).toBe('int')
        expect(val2.value).toBe(2n)
    })

    it('object literal', () => {
        const result = runProgram('{a: 1}', new Scope())
        expect(result.type).toBe('object')
        const a = (result as ObjectVal).value?.get('a')
        expect(a?.type).toBe('int')
        expect(a?.value).toBe(1n)
    })

    it('var declaration', () => {
        const scope = new Scope()
        const result = runProgram('let a, b = 1, 2;', scope)
        expect(result.type).toBe('void')
        expect(result.value).toBe(null)
        expect(scope.lookupVar('a')?.val.value).toBe(1n)
        expect(scope.lookupVar('b')?.val.value).toBe(2n)
    })

    it('var assignment', () => {
        const scope = new Scope() 
        const result = runProgram(`
            let a = 1;
            a = 2 
        `, scope)
        expect(result.type).toBe('int')
        expect(scope.lookupVar('a')?.val.value).toBe(2n)
    })

    it('const assignment throws an error', () => {
        try {
            runProgram(`
                const a = 1;
                a = 2
            `, new Scope())
            fail('You were able to assign to a const')
        } catch(e) {
            expect(e).toInclude("'a'")
        }
    })

    it('type mismatch assignment throws error', () => {
        try {
            runProgram(`
                let a = 1;
                a = true
            `, new Scope())
            fail('You were able to assign to a const')
        } catch(e) {
            expect(e).toInclude('Mismatched assignment')
        }
    })

    it('object prop assignment', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = { a: 1 };
            a.a = 2
            a.a
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(2n)
        const val = scope.lookupVar('a').val as ObjectVal
        expect(val.value?.get('a')?.type).toBe('int')
        expect(val.value?.get('a')?.value).toBe(2n)
    })

    it('array assignment', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = [1, 1, 1];
            a[1] = 2
            a[1]
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(2n)
        const val = scope.lookupVar('a').val as ArrayVal
        expect(val.value[1].type).toBe('int')
        expect(val.value[1].value).toBe(2n)
    })

    it('if statement when true', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = 1;
            if true {
                a = 2
            } 
            a
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(2n)
        const val = scope.lookupVar('a').val as IntVal
        expect(val.type).toBe('int')
        expect(val.value).toBe(2n)
    })

    it('if statement when false', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = 1;
            if false {
                a = 2
            } 
            a
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
        const val = scope.lookupVar('a').val as IntVal
        expect(val.type).toBe('int')
        expect(val.value).toBe(1n)
    })

    it('while statement', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = 1;
            while a < 10 {
                a = a + 1
            }
            a
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(10n)
        const val = scope.lookupVar('a').val as IntVal
        expect(val.type).toBe('int')
        expect(val.value).toBe(10n)
    })

    it('function declaration', () => {
        const scope = new Scope()
        const result = runProgram(`
            func addOne(n) {
                n + 1
            }
            addOne(1)
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(2n)
    })

    it('function can reassign parent scope', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = 0;
            func incrementA() {
                a = a + 1
            }
            incrementA()
            a
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
        const val = scope.lookupVar('a').val as IntVal
        expect(val.type).toBe('int')
        expect(val.value).toBe(1n)
    })

    it('object nil check', () => {
        const scope = new Scope()
        const result = runProgram(`
            let obj = { a: 1 };
            obj == nil
        `, scope)
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('nil nil check', () => {
        const scope = new Scope()
        const result = runProgram(`
            let obj = nil;
            obj == nil
        `, scope)
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(true)
    })

    it('functions can return other functions', () => {
        const scope = new Scope()
        const result = runProgram(`
            func a() {
                func b() {
                    1
                }
            }
            a()
        `, scope)
        expect(result.type).toBe('function')
    })

    it('call exressions are recursive', () => {
        const scope = new Scope()
        const result = runProgram(`
            let a = 0;
            func b() {
                func c() {
                    func d() {
                        a = 1
                    }
                }
            }
            b()()()
            a
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
        const val = scope.lookupVar('a').val as IntVal
        expect(val.type).toBe('int')
        expect(val.value).toBe(1n)
    })

    it('functions can be embedded into arrays', () => {
        const scope = new Scope()
        const result = runProgram(`
            func a() {
                1
            }
            ([a])[0]()
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
    })

    it('functions can be embedded into objects', () => {
        const scope = new Scope()
        const result = runProgram(`
            func a() {
                1
            }
            ({ a }).a()
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
    })

    it('ternary expression when true', () => {
        const scope = new Scope()
        const result = runProgram(`
            true ? 1 : 2
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(1n)
    })

    it('ternary expression when false', () => {
        const scope = new Scope()
        const result = runProgram(`
            false ? 1 : 2
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(2n)
    })

    it('recursion works', () => {
        const scope = new Scope()
        const result = runProgram(`
            func factorial(n) {
                n == 1 ? 1 : n * factorial(n - 1)
            }
            factorial(4)
        `, scope)
        expect(result.type).toBe('int')
        expect(result.value).toBe(24n)
    })

    it('error when doing binary ops on mismatched types', () => {
        try {
            runProgram(`
                1 + true
            `, new Scope())
        } catch(e) {
            expect(e).toInclude('Both sides of binary expression must be the same type')
        }
    })

    it('error when dividing by int zero', () => {
        try {
            runProgram(`
                1 / 0
            `, new Scope())
        } catch(e) {
            expect(e).toInclude('You can not divide by zero')
        }
    })

    it('error when dividing by float zero', () => {
        try {
            runProgram(`
                1.0 / 0.0
            `, new Scope())
        } catch(e) {
            expect(e).toInclude('You can not divide by zero')
        }
    })

    it('bang operator', () => {
        const result = runProgram('!true', new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('negative unary op int', () => {
        const result = runProgram(`
            let n = 1;
            1 - -n
        `, new Scope())
        expect(result.type).toBe('int')
        expect(result.value).toBe(2n)
    })

    it('negative unary op float', () => {
        const result = runProgram(`
            let n = 1.0;
            1.0 - -n
        `, new Scope())
        expect(result.type).toBe('int')
        expect(result.value).toBe(2)
    })

    it('throws error when provided an unexpected ast node', () => {
        try {
            const node = { kind: 'Unknown' }
            // @ts-ignore
            evaluate(node, new Scope())
        } catch(e) {
            expect(e).toInclude('This AST Node has not yet been setup for interpretation')
        }
    })

    it('equality has more precedence than logical and', () => {
        const result = runProgram(`
            1 == 2 && 1 == 1
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('inequality has more precedence than logical and', () => {
        const result = runProgram(`
            1 != 2 && 1 != 1
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('greater than has more precedence than logical and', () => {
        const result = runProgram(`
            1 < 2 && 1 < 1
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('less than has more precedence than logical and', () => {
        const result = runProgram(`
            1 > 2 && 1 > 1
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })
    
    it('greater than or equal to has more precedence than logical and', () => {
        const result = runProgram(`
            1 >= 2 && 1 >= 1
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('less than or equal to has more precedence than logical and', () => {
        const result = runProgram(`
            1 <= 1 && 2 <= 1
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(false)
    })

    it('logical and has greater precedence than logical or', () => {
        const result = runProgram(`
            false && false || true && true
        `, new Scope())
        expect(result.type).toBe('boolean')
        expect(result.value).toBe(true)
    })

    it('indexing into string', () => {
        const result = runProgram(`
            let s = 'abc';
            s[0]
        `, new Scope())
        expect(result.type).toBe('string')
        expect(result.value).toBe('a')
    })
})