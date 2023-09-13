import GomiParser from "../src/frontend/parser"
import { evaluate } from "../src/runtime/interpreter"
import Scope from "../src/runtime/scope"

export async function evalFile(fileName: string) {
    const file = Bun.file(fileName)
    const src = await file.text() 

    const parser = new GomiParser()
    const program = parser.produceAST(src)

    return evaluate(program, new Scope())
}
