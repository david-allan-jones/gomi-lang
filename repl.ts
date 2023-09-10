import Parser from "./src/parser";

repl()

function repl() {
    const parser = new Parser()
    console.log("GOMI Repl v0.1")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        const program = parser.produceAST(input)
        console.log(program)
    }
}