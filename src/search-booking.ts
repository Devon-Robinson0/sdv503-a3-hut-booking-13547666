import { ask, displayBooking, enterCommand, loadBookings, type Booking } from './commands.js';
import { blueText, errorText } from './logger.js';

export async function searchBooking() {
    const name = await getName();

    

    const bookings: Booking[] = await loadBookings();

    if (name === '') {
        for (const booking of bookings) {
            displayBooking(booking);
        }

    } else {
        const matches: Booking[] = bookings.filter(b => b.tramperName.toLowerCase().includes(name));

        for (const match of matches) {
            displayBooking(match);
        }
        
    }

    enterCommand();
}

async function getName(): Promise<string> {
    let name: string = '';

    name = (await ask(blueText("Enter tramper name: ")))
        .trim()
        .toLowerCase();

    return name;
}