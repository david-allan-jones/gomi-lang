import { describe, expect, it } from "bun:test";
import { _resolveFilename } from "module";
import { evalFile } from "./fileRead";
import { unrecognizedError } from "../src/frontend/tokenizer";

// TODO: Get this working so it doesn't require being at root
function getFileName(path: string) {
    return `test/${path}`
}

describe('File reader', () => {
    describe('correct file parsing', () => {
        it('simple.gomi', async () => {
            const filePath = getFileName('simple.gomi')
            const val = await evalFile(filePath)
            expect(val.value).toBe(-4n)
        })
        it('long-expression.gomi', async () => {
            const filePath = getFileName('long-expression.gomi')
            const val = await evalFile(filePath)
            expect(val.value).toBe(10000n)
        })
    })
    describe('correct file parsing', () => {
        it('invalid-character.gomi', async () => {
            const filePath = getFileName('invalid-character.gomi')
            const t = async () => {
                const val = await evalFile(filePath)
            }
            expect(t).toThrow(unrecognizedError(1, '@'))
        })
    })
})