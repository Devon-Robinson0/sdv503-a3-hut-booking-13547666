import { ask, closeRl } from './commands.js';
import { section, topic, dimmedText, blueText, magentaText, errorText } from './logger.js';
export async function createNewBooking() {
    const tramperName = await getTramperName();
    // const hut: string = await ask(blueText("Enter hut: "));
    // const partySize: string = await ask(blueText("Enter party size: "));
    // const arrivalDate: string = await ask(blueText("Enter arrival date: "));
    // const nightsOfStay: string = await ask(blueText("Enter nights of stay: "));
    // const isMember: string = await ask(blueText("Are you a member? (y/n): "));
    closeRl();
}
async function getTramperName() {
    let tramperName = '';
    try {
        tramperName = await ask(blueText("Enter Tramper Name: "));
        if (tramperName.trim() === '') {
            throw new Error("Name cannot be empty");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        else {
            console.log(err);
        }
        await getTramperName();
    }
    return tramperName;
}
async function getHut() {
    let hut = '';
    try {
        hut = await ask(blueText("Enter Hut: "));
        if (hut.trim() === '') {
            throw new Error("Hut cannot be empty");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        }
        else {
            console.log(err);
        }
        getHut();
    }
}
//# sourceMappingURL=create-new-booking.js.map