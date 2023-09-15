import { print_runtime_val } from "../print"
import { RuntimeVal, mk_function } from "../types"

type Global = {
    identifiers: string[],
    value: RuntimeVal<unknown>
}

const globals: Global[] = [
    {
        identifiers: ["print", "プリント"],
        value: mk_function(args => {
            for (let i = 0; i < args.length; i++) {
                print_runtime_val(args[i])
            }
            return { type: 'void', value: null }
        })
    },
    {
        identifiers: ["now", "今"],
        value: mk_function(args => ({
            type: 'int',
            value: BigInt(Date.now())
        }))
    }
]

export default globals