import Parser from "./src/parser";
import { evaluate } from "./src/runtime/interpreter";

repl()

function repl() {
    const parser = new Parser()
    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("＞ ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        const program = parser.produceAST(input)

        const result = evaluate(program)
        if (result)
        console.log(result)
    }
}