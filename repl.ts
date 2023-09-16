import GomiParser from "./src/frontend/parser"
import { evaluate } from "./src/runtime/interpreter"
import { print_runtime_val } from "./src/runtime/print"
import { createGlobalScope } from "./src/runtime/scope/scope"

const readline = require('readline')

// Create a readline interface for input and output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
})



const parser = new GomiParser()
const scope = createGlobalScope()
function runRepl(code: string) {
    try {
        const program = parser.produceAST(code)
        const runtimeVal = evaluate(program, scope)
        if (runtimeVal.type === 'void' || runtimeVal.type === 'function' || runtimeVal.type === 'native-function') {
            return
        }
        print_runtime_val(runtimeVal)
    } catch(e) {
        console.error(e)
    }
}

let buffer = ''
const stack: string[] = []

// Listen for input
rl.on('line', (input: string) => {
    // Handle exit
    if (input === 'exit') {
        console.log("さようなら")
        rl.close()
        return
    }

    // Handle stack
    if (input.endsWith('{') || input.endsWith('｛')) {
        stack.push('{')
    }
    if (input.endsWith('}') || input.endsWith('｝')) {
        stack.pop()
    }

    // Execute
    if (stack.length) {
        buffer += `\n${input}`
    } else {
        console.log(`${buffer}\n${input}`)
        runRepl(`${buffer}\n${input}`)
        buffer = ''
    }
    rl.prompt()
})

console.log("ゴミ箱へようこそ")
rl.prompt()
