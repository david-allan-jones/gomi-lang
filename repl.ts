import Parser from "./src/frontend/parser";
import { evaluate } from "./src/runtime/interpreter";
import Scope from "./src/runtime/scope";

repl()

function repl() {
    const parser = new Parser()
    const scope = new Scope()

    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        const program = parser.produceAST(input)
        const result = evaluate(program, scope)
        console.log(result)
    }
}