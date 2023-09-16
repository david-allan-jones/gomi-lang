import { print_runtime_val } from "../print"
import { ArrayVal, RuntimeVal, mk_native_function } from "../types"

type Global = {
    identifiers: string[],
    value: RuntimeVal<unknown>
}

const globals: Global[] = [
    {
        identifiers: ["print", "プリント"],
        value: mk_native_function(args => {
            for (let i = 0; i < args.length; i++) {
                print_runtime_val(args[i])
            }
            return { type: 'void', value: null }
        })
    },
    {
        identifiers: ["now", "今"],
        value: mk_native_function(args => ({
            type: 'int',
            value: BigInt(Date.now())
        }))
    },
    {
        identifiers: ["len", "サイス"],
        value: mk_native_function(args => {
            if (args.length > 1) {
                throw `This function only takes one argument`
            }
            if (args[0].type !== 'array') {
                throw `Argument must be of type array`
            }
            const arr = args[0] as ArrayVal
            return {
                type: 'int',
                value: arr.value.length
            }
        })
    }
]

export default globals