import { tokenize } from "./src/frontend/tokenizer";

repl()

function repl() {
    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        try {
            const tokens = tokenize(input)
            console.log(tokens)
        } catch(e) {
            console.error(e)
        }
    }
}