import GomiParser from "./src/frontend/parser";
import { evaluate } from "./src/runtime/interpreter";
import { print_runtime_val } from "./src/runtime/print";
import { createGlobalScope } from "./src/runtime/scope/scope";

repl()

function repl() {
    const parser = new GomiParser()
    const scope = createGlobalScope()

    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        try {
            const program = parser.produceAST(input)
            const runtimeVal = evaluate(program, scope)
            if (runtimeVal.type === 'void' || runtimeVal.type === 'function' || runtimeVal.type === 'native-function') {
                continue
            }
            print_runtime_val(runtimeVal)
        } catch(e) {
            console.error(e)
        }
    }
}