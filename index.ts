import { tokenize } from "./src/lexer"

const yargs = require('yargs')

const parsedArgs = yargs(process.argv)
console.log(parsedArgs)

const filePath = process.argv[2]

const file = Bun.file(filePath)
const src = await file.text()

console.log(src)
const tokens = tokenize(src)

console.log(JSON.stringify(tokens))