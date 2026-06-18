import { ask, displayBooking, enterCommand, loadBookings } from './commands.js';
import { blueText, dimmedText, errorText } from './logger.js';
export async function searchBooking() {
    const name = await getName();
    const bookings = await loadBookings();
    if (name === '') {
        for (const booking of bookings) {
            displayBooking(booking);
        }
    }
    else {
        const matches = bookings.filter(b => b.tramperName.toLowerCase().includes(name));
        for (const match of matches) {
            displayBooking(match);
        }
        if (matches.length === 0) {
            console.log(dimmedText("\n~no bookings found~\n"));
        }
    }
    enterCommand();
}
async function getName() {
    let name = '';
    name = (await ask(blueText("Enter tramper name: ")))
        .trim()
        .toLowerCase();
    return name;
}
//# sourceMappingURL=search-booking.js.map