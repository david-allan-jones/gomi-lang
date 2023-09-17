import { ArrayVal, FunctionValue, IntVal, ObjectVal, RuntimeVal } from './types'

export function print_runtime_val(runtimeVal: RuntimeVal<unknown>, color = true): void {
    let serialized
    switch(runtimeVal.type) {
        case 'object':
            serialized = serialize_obj(runtimeVal as ObjectVal)
            break
        case 'array':
            serialized = serialize_array(runtimeVal as ArrayVal)
            break
        case 'int':
            serialized = serialize_int(runtimeVal as IntVal)
            break
        case 'string':
            serialized = `'${runtimeVal.value}'`
            break
        case 'function':
            serialized = `[Function: ${(runtimeVal as FunctionValue).name}]`
            break
        default:
            serialized = `${runtimeVal.value}`
            break
    }
    if (color) serialized = `\x1b[33m${serialized}\x1b[0m`
    console.log(serialized)
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
        let val
        if (value.type === 'object') {
            val = serialize_obj(value as ObjectVal, nestedLevel + 1)
        } else if (value.type === 'string') {
            val = `'${value.value}'`
        } else if (value.type === 'array') {
            val = serialize_array(value as ArrayVal, nestedLevel + 1)
        } else if (value.type === 'function') {
            val = serialize_function(value as FunctionValue)
        } else {
            val = value.value
        }
        serialized += `${keyPadding}${key}: ${val}\n`
    }
    serialized += `${closingBracePadding}}`

    return serialized
}

function serialize_array(arr: ArrayVal, nestedLevel = 1): string {
    const padding = ' '.repeat((nestedLevel)*2)
    const bracketPadding = ' '.repeat((nestedLevel - 1)*2)
    if (arr.value.length === 0) {
        return '[]'
    }

    let serialized = '[\n'
    for (let i = 0; i < arr.value.length; i++) {
        const indexVal = arr.value[i]
        let val
        if (indexVal.type === 'object') {
            val = serialize_obj(indexVal as ObjectVal, nestedLevel + 1)
        } else if (indexVal.type === 'array') {
            val = serialize_array(indexVal as ArrayVal, nestedLevel + 1)
        } else if (indexVal.type === 'function') {
            val = serialize_function(indexVal as FunctionValue)
        } else if (indexVal.type === 'string') {
            val = `'${indexVal.value}'`
        } else {
            val = indexVal.value
        }
        serialized += `${padding}${val},\n`
    }
    serialized += `${bracketPadding}]`

    return serialized
}

function serialize_int(int: IntVal): string {
    return int.value.toString()
}

function serialize_function(func: FunctionValue): string {
    return `[Function: ${func.name}]`
}
