import { blueText, errorText } from "./logger.js";
import { ask, enterCommand, loadSeason, updateSeason } from "./commands.js";
const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec"
];
export async function configSeason() {
    const season = await getNewSeason();
    updateSeason(season);
    enterCommand();
}
async function getNewSeason() {
    const currentSeason = await loadSeason();
    let season = { ...currentSeason };
    try {
        const seasonInput = (await ask(blueText("Enter season start and end months (start -> end): ")))
            .trim()
            .toLowerCase();
        if (seasonInput === "") {
            throw new Error("Season must not be left empty");
        }
        const segments = seasonInput.split('->');
        season.startMonth = months.findIndex(m => m === segments[0]?.trim()) + 1;
        season.endMonth = months.findIndex(m => m === segments[1]?.trim()) + 1;
        if (season.startMonth === 0 || season.endMonth === 0) {
            throw new Error("Month was not found");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        season = await getNewSeason();
    }
    return season;
}
//# sourceMappingURL=config-season.js.map