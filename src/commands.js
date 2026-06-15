import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { section, topic, dimmedText, blueText, magentaText, errorText } from './logger.js';
let bookings = [];
const createNewBookingCommands = [
    "create",
    "createnewbooking",
    "create new booking"
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
async function enterCommand() {
    const command = await ask(blueText("Enter a command ('help' to see all commands): "));
    if (createNewBookingCommands.includes(command.toLowerCase().trim())) {
        promptNewBooking();
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
export function closeRl() {
    rl.close();
}
enterCommand();
//# sourceMappingURL=commands.js.map