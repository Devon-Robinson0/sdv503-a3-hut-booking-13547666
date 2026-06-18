import chalk from 'chalk';
export function section(text, spacerValue) {
    return chalk.bold.bgGray.whiteBright(`\n${' '.repeat(spacerValue)}----|${text}|----\n`);
}
export function topic(text) {
    return chalk.bold.redBright(text);
}
export function dimmedText(text) {
    return chalk.dim(text);
}
export function magentaText(text) {
    return chalk.bold.magentaBright(text);
}
export function yellowText(text) {
    return chalk.bold.yellowBright(text);
}
export function blueText(text) {
    return chalk.bold.blueBright(text);
}
export function errorText(text) {
    return chalk.bold.redBright(text);
}
export function displayMagPair(text, prop) {
    return magentaText(text) + dimmedText(prop);
}
//# sourceMappingURL=logger.js.map