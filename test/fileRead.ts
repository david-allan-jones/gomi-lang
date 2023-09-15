import GomiParser from "../src/frontend/parser"
import { evaluate } from "../src/runtime/interpreter"
import { createGlobalScope } from "../src/runtime/scope/scope"

export async function evalFile(fileName: string) {
    const file = Bun.file(fileName)
    const src = await file.text() 

    const parser = new GomiParser()
    const scope = createGlobalScope()
    const program = parser.produceAST(src)
    

    return evaluate(program, scope)
}
