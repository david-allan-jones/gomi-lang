import { RuntimeVal } from "../../types";
import print from "./print";
import time from "./time";

type Global = {
    identifier: string,
    value: RuntimeVal<unknown>
}

const globals: Global[] = [
    print,
    time
]

export default globals