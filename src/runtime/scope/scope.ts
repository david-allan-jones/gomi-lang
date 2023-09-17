import { RuntimeVal } from "../types"
import globals from './globals'

export function createGlobalScope(): Scope {
    const scope = new Scope()
    for (let i = 0; i < globals.length; i++) {
        const { identifiers, value } = globals[i]
        for (let j = 0; j < identifiers.length; j++) {
            scope.declareVar(identifiers[j], value, false) 
        }
    }
    return scope
}

export function declareError(symbol: string): string {
    return `Cannot declare variable ${symbol} as it is already define.`
}

export function resolveError(symbol: string): string {
    return `Cannot resolve ${symbol} as it has not be declared.`
}

type SymbolTableEntry = { val: RuntimeVal<unknown>, mutable: boolean }
type SymbolTable = Map<string, SymbolTableEntry>

export default class Scope {
    // undefined => global scope
    private parent?: Scope
    private symbolTable: SymbolTable

    constructor(parent?: Scope) {
        this.parent = parent
        this.symbolTable = new Map()
    }

    public declareVar(symbol: string, val: RuntimeVal<unknown>, mutable: boolean): RuntimeVal<unknown> {
        if (this.symbolTable.has(symbol)) {
            throw declareError(symbol)
        }
        this.symbolTable.set(symbol, { val, mutable })
        return val
    }

    public assignVar(symbol: string, val: RuntimeVal<unknown>): RuntimeVal<unknown> {
        const scope = this.resolve(symbol) 
        scope.symbolTable.set(symbol, { val, mutable: true })
        return val
    }

    public lookupVar(symbol: string): SymbolTableEntry {
        const scope = this.resolve(symbol)
        return scope.symbolTable.get(symbol) as SymbolTableEntry
    }

    public resolve(symbol: string): Scope {
        if (this.symbolTable.has(symbol)) return this
        if (this.parent === undefined) {
            throw resolveError(symbol)
        }
        return this.parent.resolve(symbol)
    }
    
}