import { describe, expect, it } from "bun:test"
import { evalNumericBinaryExpr } from "./expressions";

describe('evalNumericBinaryExpr', () => {
    it('should perform addition correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 5 }, { type: 'number', value: 3 }, '+');
        expect(result).toEqual({ type: 'number', value: 8 });
    });

    it('should perform subtraction correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 10 }, { type: 'number', value: 4 }, '-');
        expect(result).toEqual({ type: 'number', value: 6 });
    });

    it('should perform multiplication correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 6 }, { type: 'number', value: 7 }, '*');
        expect(result).toEqual({ type: 'number', value: 42 });
    });

    it('should perform division correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 20 }, { type: 'number', value: 5 }, '/');
        expect(result).toEqual({ type: 'number', value: 4 });
    });

    it('should perform modulo correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 17 }, { type: 'number', value: 5 }, '%');
        expect(result).toEqual({ type: 'number', value: 2 });
    });

    it('should perform exponentiation correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 2 }, { type: 'number', value: 3 }, '^');
        expect(result).toEqual({ type: 'number', value: 8 });
    });

    it('should perform greater than comparison correctly', () => {
        const result = evalNumericBinaryExpr({ type: 'number', value: 10 }, { type: 'number', value: 5 }, '>');
        expect(result).toEqual({ type: 'boolean', value: true });
    });
});
