import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { section, topic, dimmedText, blueText, magentaText, errorText, displayMagPair } from './logger.js';
import { cancelBooking } from './cancel-booking.js';
import { viewHutBookings } from './view-hut-bookings.js';
let bookings = [];
const exitCommands = [
    "exit",
    "quit"
];
const createNewBookingCommands = [
    "create",
    "createnewbooking",
    "create new booking"
];
const cancelBookingCommands = [
    "cancel",
    "cancelbooking",
    "cancel booking"
];
const viewHutBookingCommands = [
    "viewhutbooking",
    "view hut booking"
];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
export function ask(q) {
    return new Promise(resolve => rl.question(q, resolve));
}
export async function loadHuts() {
    const raw = await fs.readFile("huts.json", "utf-8");
    return JSON.parse(raw);
}
export async function loadBookings() {
    const raw = await fs.readFile("bookings.json", "utf-8");
    return JSON.parse(raw);
}
export async function updateBookings(bookings) {
    await fs.writeFile("bookings.json", JSON.stringify(bookings, null, 2));
}
export async function enterCommand() {
    const command = (await ask(blueText("Enter a command ('help' to see all commands): ")))
        .trim()
        .toLowerCase();
    if (createNewBookingCommands.includes(command)) {
        promptNewBooking();
    }
    else if (cancelBookingCommands.includes(command)) {
        cancelBooking();
    }
    else if (viewHutBookingCommands.includes(command)) {
        viewHutBookings();
    }
    else if (exitCommands.includes(command)) {
        rl.close();
    }
    else {
        enterCommand();
    }
}
async function promptNewBooking() {
    createNewBooking();
}
export async function saveNewBooking(booking) {
    const currentBookings = await loadBookings();
    currentBookings.push(booking);
    await fs.writeFile('bookings.json', JSON.stringify(currentBookings, null, 2));
}
export async function displayBooking(booking) {
    let bookingText = magentaText('\n--- Booking ---');
    const memberText = booking.isMember ? 'Yes' : "No";
    bookingText += displayMagPair("\nBooking ID: ", booking.bookingId);
    bookingText += displayMagPair("\nTramper Name: ", booking.tramperName);
    bookingText += displayMagPair("\nHut: ", booking.hut);
    bookingText += displayMagPair("\nArrival Date: ", String(booking.arrivalDate));
    bookingText += displayMagPair("\nNights: ", String(booking.nights));
    bookingText += displayMagPair("\nParty Size: ", String(booking.partySize));
    bookingText += displayMagPair("\nMember: ", memberText);
    console.log(bookingText += magentaText('\n---------------'));
}
export function closeRl() {
    rl.close();
}
enterCommand();
//# sourceMappingURL=commands.js.map