import { print_runtime_val } from "../print"
import { ArrayVal, IntVal, RuntimeVal, mk_native_function } from "../types"

const nativeFuncs = [
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
                value: BigInt(arr.value.length)
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
    },
    {
        identifiers: ["append", "追加"],
        value: mk_native_function(args => {
            if (args.length !== 2) {
                throw 'append takes 2 arguments'
            }
            const arr = args[0] as ArrayVal
            const val = args[1] as RuntimeVal<unknown>
            return {
                type: 'array',
                value: [...arr.value, val]
            }
        })
    },
    {
        identifiers: ["slice", "スライス"],
        value: mk_native_function(args => {
            if (args.length !== 2 && args.length !== 3) {
                throw 'slice takes 2-3 arguments'
            }
            const arr = args[0] as ArrayVal
            const start = args[1] as IntVal
            if (args[2] === undefined) {
                return {
                    type: 'array',
                    value: arr.value.slice(Number(start.value))
                }
            }
            const end = args[2] as IntVal
            return {
                type: 'array',
                value: arr.value.slice(Number(start.value), Number(end.value))
            }
        })
    },
]

export default nativeFuncs