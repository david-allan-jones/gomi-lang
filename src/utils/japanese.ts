function fwDigit(charCode: number): boolean {
    return 65296 <= charCode && charCode <= 65305
}

function hwDigit(charCode: number): boolean {
    return 48 <= charCode && charCode <= 57
}

function toHwDigit(charCode: number): string {
    return String.fromCharCode(charCode - 65248)
}

export function normalizeInt(numString: string): bigint {
    let normalized = ''
    for (let i = 0; i < numString.length; i++) {
        const charCode = numString.charCodeAt(i)
        if (fwDigit(charCode)) {
            normalized += toHwDigit(charCode)
            continue
        }
        else if (hwDigit(charCode)) {
            normalized += numString[i]
            continue
        }
        // unexpected characters
        throw `An unexpected number character was encountered while normalizing number: ${numString[i]}`
    }
    return BigInt(normalized)
}

export function normalizeFloat(numString: string): number {
    let normalized = ''
    for (let i = 0; i < numString.length; i++) {
        const charCode = numString.charCodeAt(i)
        if (fwDigit(charCode)) {
            normalized += toHwDigit(charCode)
            continue
        }
        else if (hwDigit(charCode)) {
            normalized += numString[i]
            continue
        }
        if (numString[i] === '.' || numString[i] === '．') {
            normalized += numString[i]
            continue
        }
        // unexpected characters
        throw `An unexpected number character was encountered while normalizing float: ${numString[i]}`
    }
    return Number(normalized)
}

export function normalizeBinaryOp(opString: string): string {
    if (opString[0] === '＝') {
        return '=='
    } else if (opString[0] === '！') {
        return '!='
    } else if (opString[0] === '＞') {
        if (opString[1] === '＝') {
            return '>='
        }
        return '>'
    } else if (opString[0] === '＜') {
        if (opString[1] === '＝') {
            return '<='
        }
        return '<'
    }
    return opString
}