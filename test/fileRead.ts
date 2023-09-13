import GomiParser from "../src/frontend/parser"
import { evaluate } from "../src/runtime/interpreter"
import Scope from "../src/runtime/scope"
import fs from 'fs'

export async function evalFile(fileName: string) {
    const file = Bun.file(fileName)
    const src = await file.text() 

    const parser = new GomiParser()
    const program = parser.produceAST(src)
    
    console.log(program)

    return evaluate(program, new Scope())
}
