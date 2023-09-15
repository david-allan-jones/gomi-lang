import { mk_function } from "../../types"

const print = {
    identifier: "time",
    value: mk_function(args => {
        return {
            type: 'int',
            value: Date.now()
        }
    })
}

export default print