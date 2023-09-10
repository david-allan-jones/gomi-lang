import { tokenize } from "./src/lexer"

const filePath = process.argv[2]

const file = Bun.file(filePath)
const src = await file.text()

const tokens = tokenize(src)

console.log(JSON.stringify(tokens))