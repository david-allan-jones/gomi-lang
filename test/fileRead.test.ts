import { describe, expect, it } from "bun:test";
import { _resolveFilename } from "module";
import Parser from "../src/frontend/parser";
import { evaluate } from "../src/runtime/interpreter";
import Scope from "../src/runtime/scope";
import { evalFile } from "./fileRead";

describe('File reader', () => {
    const targets = ['test/good.gomi']
    for (let i = 0; i < targets.length; i++) {
        const fileName = targets[i]

        it(`can interpret '${fileName}'`, async () => {
            const val = await evalFile(fileName)
            expect(val.value).toBe(-4)
        })
    }
})