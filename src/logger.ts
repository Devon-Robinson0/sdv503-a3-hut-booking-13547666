import chalk from 'chalk';

export function section(text: string, spacerValue: number): string {
    return chalk.bold.bgGray.whiteBright(`\n${' '.repeat(spacerValue)}----|${text}|----\n`);
}

export function topic(text: string): string {
    return chalk.bold.redBright(text);
}

export function dimmedText(text: string): string {
    return chalk.dim(text);
}

export function magentaText(text: string): string {
    return chalk.bold.magentaBright(text);
}

export function yellowText(text: string): string {
    return chalk.bold.yellowBright(text);
}

export function blueText(text: string): string {
    return chalk.bold.blueBright(text);
}

export function errorText(text: string): string {
    return chalk.bold.redBright(text);
}

export function displayMagPair(text: string, prop: string) {
    return magentaText(text) + dimmedText(prop);
}