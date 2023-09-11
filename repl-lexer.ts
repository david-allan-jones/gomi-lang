import { tokenize } from "./src/frontend/lexer";

repl()

function repl() {
    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        const result = tokenize(input)
        console.log(result)
    }
}