import Parser from "./src/parser";
import { tokenize } from "./src/lexer";

repl()

function repl() {
    const parser = new Parser()
    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("＞ ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        const result = tokenize(input)
        console.log(result)
    }
}