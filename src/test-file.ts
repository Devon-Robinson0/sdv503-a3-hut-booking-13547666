import { enterCommand, loadBookings, loadHuts, loadSeason } from "./commands.js";
import { dimmedText, errorText } from "./logger.js";

export async function testFiles() {
    let errorsFound: number = 0;

    try {
        await loadBookings();
    } catch (err) {
        errorsFound++;
        console.log(errorText("Corrupt file found: bookings.json"));
    }

    try {
        await loadHuts();
    } catch (err) {
        errorsFound++;
        console.log(errorText("Corrupt file found: huts.json"));
    }

    try {
        await loadSeason();
    } catch (err) {
        errorsFound++;
        console.log(errorText("Corrupt file found: season.json"));
    }

    if (errorsFound === 0) {
        console.log(dimmedText("\n~No Errors Found~\n"))
    }

    enterCommand();
}