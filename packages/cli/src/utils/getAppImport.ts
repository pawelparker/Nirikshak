export function getAppImport(absolutePath: string): string {
    return absolutePath.replace(/.(ts|js)$/, "");
}
