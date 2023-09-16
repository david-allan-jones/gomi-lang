import { RuntimeVal } from "../types"
import nativeFuncs from "./native-funcs"

type Global = {
    identifiers: string[],
    value: RuntimeVal<unknown>
}

const globals: Global[] = [
    ...nativeFuncs,
]

export default globals