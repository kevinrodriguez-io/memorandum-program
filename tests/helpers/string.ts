import { TextEncoder } from "util";

// Converts a string to bytes
export const toBytes = (str: string) => new TextEncoder().encode(str);
export const b = (input: TemplateStringsArray) => toBytes(input.join(""));
