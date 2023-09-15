import { print_runtime_val } from "../../print"
import { mk_function } from "../../types"

const print = {
    identifier: "print",
    value: mk_function(args => {
        for (let i = 0; i < args.length; i++) {
            print_runtime_val(args[i])
        }
        return { type: 'void', value: null }
    })
}

export default print