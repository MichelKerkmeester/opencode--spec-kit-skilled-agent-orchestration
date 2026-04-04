declare function promptUser(question: string, defaultValue?: string, requireInteractive?: boolean): Promise<string>;
declare function promptUserChoice(question: string, maxChoice: number, maxAttempts?: number, requireInteractive?: boolean): Promise<number>;
export { promptUser, promptUserChoice, };
//# sourceMappingURL=prompt-utils.d.ts.map