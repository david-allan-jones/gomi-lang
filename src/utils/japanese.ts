// Convert half-width and full-width numbers into number
export function normalizeInt(numString: string): bigint {
    let normalized = ''
    for (let i = 0; i < numString.length; i++) {
        const charCode = numString.charCodeAt(i)
        // full-width
        if (65296 <= charCode && charCode <= 65305) {
            normalized += String.fromCharCode(charCode - 65248)
            continue
        }
        // half-width
        else if (48 <= charCode && charCode <= 57) {
            normalized += numString[i]
            continue
        }
        // unexpected characters
        throw `An unexpected number character was encountered while normalizing integer: ${numString[i]}`
    }
    return BigInt(normalized)
}