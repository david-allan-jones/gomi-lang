import { print_runtime_val } from "./src/runtime/print"
import { evalFile } from "./test/fileRead"

const filePath = process.argv[2]
const val = await evalFile(filePath)

if (!(val.type === 'void' || val.type === 'function' || val.type === 'native-function')) {
    print_runtime_val(val, false)
}