import GomiTokenizer from "./src/frontend/tokenizer";

repl()

function repl() {
    console.log("ゴミ箱へようこそ")
    while (true) {
        const input = prompt("> ")
        if (!input || input.includes('exit')) {
            process.exit(0)
        }

        try {
            const tokenizer = new GomiTokenizer(input)
            while (tokenizer.not_eof()) {
                console.log(tokenizer.read_token())
            }
        } catch(e) {
            console.error(e)
        }
    }
}