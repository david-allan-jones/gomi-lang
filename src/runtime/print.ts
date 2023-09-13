import { IntVal, RuntimeVal } from './types'

export function print_runtime_val(runtimeVal: RuntimeVal<unknown>): void {
    let serialized
    switch(runtimeVal.type) {
        case 'nil':
            serialized = 'nil'
            break
        case 'int':
            serialized = print_int_val(runtimeVal as IntVal)
            break
        default:
            serialized = `${runtimeVal.value}`
            break
    }
    console.log(`\x1b[33m${serialized}\x1b[0m`)
}

function print_int_val(val: IntVal) {
    return val.value.toString()
}
