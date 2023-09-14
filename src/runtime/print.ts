import { IntVal, ObjectVal, RuntimeVal } from './types'

export function print_runtime_val(runtimeVal: RuntimeVal<unknown>): void {
    let serialized
    switch(runtimeVal.type) {
        case 'object':
            serialized = serialize_obj(runtimeVal as ObjectVal)
            break
        case 'int':
            serialized = serialize_int(runtimeVal as IntVal)
            break
        default:
            serialized = `${runtimeVal.value}`
            break
    }
    console.log(`\x1b[33m${serialized}\x1b[0m`)
}

function serialize_obj(obj: ObjectVal, nestedLevel = 1): string {
    if (obj.value === undefined) {
        return 'nil'
    }
    const keyPadding = ' '.repeat((nestedLevel)*2)
    const closingBracePadding = ' '.repeat((nestedLevel - 1)*2)
    const entries = [...obj.value.entries()]
    if (entries.length === 0) {
        return '{}'
    }

    let serialized = '{\n'
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i]
        serialized += `${keyPadding}${key}: ${(value.type === 'object' ? serialize_obj(value as ObjectVal, nestedLevel + 1) : value.value)}\n`
    }
    serialized += `${closingBracePadding}}`

    return serialized
}

function serialize_int(int: IntVal): string {
    return int.value.toString()
}
