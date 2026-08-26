export const kebabToCamelCase = (value: string): string => value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
