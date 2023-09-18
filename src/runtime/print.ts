import { ArrayVal, FloatVal, FunctionValue, IntVal, ObjectVal, RuntimeVal } from './types'

export function print_runtime_val(runtimeVal: RuntimeVal<unknown>, color = true): void {
    let serialized = serialize_value(runtimeVal)
    if (color) {
        serialized = `\x1b[33m${serialized}\x1b[0m`
    }
    console.log(serialized)
}

function serialize_value(runtimeVal: RuntimeVal<unknown>, nestedLevel = 0) {
    let serialized = ''
    switch(runtimeVal.type) {
        case 'object':
            if (nestedLevel > 10) {
                serialized += '[object]'
            } else {
                serialized = serialize_obj(runtimeVal as ObjectVal, nestedLevel + 1)
            }
            break
        case 'array':
            if (nestedLevel > 10) {
                serialized += `[array size: ${(runtimeVal as ArrayVal).value.length}]`
            } else {
                serialized = serialize_array(runtimeVal as ArrayVal, nestedLevel + 1)
            }
            break
        case 'int':
            serialized = serialize_int(runtimeVal as IntVal)
            break
        case 'float':
            serialized = serialize_float(runtimeVal as FloatVal)
            break
        case 'string':
            serialized = `'${runtimeVal.value}'`
            break
        case 'function':
            serialized = serialize_function(runtimeVal as FunctionValue)
            break
        default:
            serialized = `${runtimeVal.value}`
            break
    }
    return serialized
}

function calc_front_padding(nestedLevel: number) {
    return nestedLevel === 0
        ? ''
        : ' '.repeat(nestedLevel * 2)
}

function calc_end_padding(nestedLevel: number) {
    return nestedLevel === 0
        ? ''
        : ' '.repeat((nestedLevel - 1) * 2)
}

function serialize_obj(obj: ObjectVal, nestedLevel: number): string {
    if (obj.value === undefined) {
        return 'nil'
    }
    const entries = [...obj.value.entries()]
    if (entries.length === 0) {
        return '{}'
    }

    const keyPadding = calc_front_padding(nestedLevel)
    const closingBracePadding = calc_end_padding(nestedLevel)

    let serialized = '{\n'
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i]
        serialized += `${keyPadding}${key}: ${serialize_value(value, nestedLevel)}\n`
    }
    serialized += `${closingBracePadding}}`

    return serialized
}

function serialize_array(arr: ArrayVal, nestedLevel: number): string {
    if (arr.value.length === 0) {
        return '[]'
    }

    const padding = calc_front_padding(nestedLevel)
    const bracketPadding = calc_end_padding(nestedLevel)

    let serialized = '[\n'
    for (let i = 0; i < arr.value.length; i++) {
        const indexVal = arr.value[i]
        serialized += `${padding}${serialize_value(indexVal, nestedLevel)},\n`
    }
    serialized += `${bracketPadding}]`

    return serialized
}

function serialize_int(int: IntVal): string {
    return int.value.toString()
}

function serialize_float(float: FloatVal): string {
    return float.value.toFixed(16)
}

function serialize_function(func: FunctionValue): string {
    return `[Function: ${func.name}]`
}
