import { print_runtime_val } from "../print"
import { ArrayVal, IntVal, RuntimeVal, mk_native_function } from "../types"

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
    },
    {
        identifiers: ["range", "範囲"],
        value: mk_native_function(args => {
            if (2 > args.length || 3 < args.length) {
                throw 'range takes 2-3 arguments'
            }
            for (let i = 0; i < args.length; i++) {
                if (args[i].type !== 'int') {
                    throw 'args to range should all be of type int'
                }
            }
            const start = args[0].value
            const end = args[1].value
            const step = args[2] ? args[2].value : 1n

            const result: IntVal[] = []
            // @ts-ignore
            for (let i = start; i < end; i += step) {
                result.push({ type: 'int', value: i as bigint })
            }
            return {
                type: 'array',
                value: result
            }
        })
    }
]

export default globals