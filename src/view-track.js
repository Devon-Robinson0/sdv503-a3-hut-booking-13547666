import { ask, enterCommand, loadHuts } from "./commands.js";
import { blueText, dimmedText, errorText, yellowText } from "./logger.js";
export async function viewTrack() {
    await getHuts();
    enterCommand();
}
async function getHuts() {
    let hut;
    try {
        const trackInput = (await ask(blueText("Enter Track: ")))
            .trim()
            .toLowerCase();
        const huts = await loadHuts();
        if (trackInput === '') {
            for (const hut of huts) {
                displayHut(hut);
            }
            return;
        }
        const matchingHuts = huts.filter(h => h.track.toLowerCase().includes(trackInput));
        if (matchingHuts.length === 0) {
            throw new Error("Track was not found");
        }
        for (const hut of matchingHuts) {
            displayHut(hut);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        hut = await getHuts();
    }
}
function displayHut(hut) {
    let display = '';
    display += yellowText("\n=== Hut ===");
    display += yellowText("\nHut Name: ") + dimmedText(hut.hutName);
    display += yellowText("\nTrack: ") + dimmedText(hut.track);
    display += yellowText("\nCapacity: ") + dimmedText(String(hut.capacity));
    console.log(display += yellowText("\n===========\n"));
}
//# sourceMappingURL=view-track.js.map