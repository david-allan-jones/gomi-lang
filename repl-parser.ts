import Parser from "./src/frontend/parser";

repl()

function repl() {
    const parser = new Parser()
    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        try {
            const program = parser.produceAST(input)
            console.log(program)
        } catch(e) {
            console.error(e)
        }
    }
}