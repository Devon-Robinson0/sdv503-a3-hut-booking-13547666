import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { section, topic, dimmedText, blueText, magentaText, errorText, displayMagPair } from './logger.js';
import { cancelBooking } from './cancel-booking.js';
import { viewHutBookings } from './view-hut-bookings.js';
import { searchBooking } from './search-booking.js';
import { configSeason } from './config-season.js';
import { summary } from './summary.js';
import { viewTrack } from './view-track.js';
let bookings = [];
const costPerNight = 20;
const memberCostPerNight = 18;
const exitCommands = [
    "exit",
    "quit"
];
const createNewBookingCommands = [
    "create new booking",
    "createnewbooking",
    "create"
];
const cancelBookingCommands = [
    "cancel booking",
    "cancelbooking",
    "cancel"
];
const viewHutBookingCommands = [
    "view hut booking",
    "viewhutbooking",
    "view"
];
const searchBookingCommands = [
    "search booking",
    "searchbooking",
    "search"
];
const configSeasonCommands = [
    "config season",
    "configseason",
    "config",
    "season"
];
const summaryCommands = [
    "summary"
];
const viewTrackCommands = [
    "view track",
    "viewtrack",
    "track"
];
const helpCommands = [
    exitCommands[0],
    createNewBookingCommands[0],
    cancelBookingCommands[0],
    viewHutBookingCommands[0],
    viewTrackCommands[0],
    searchBookingCommands[0],
    configSeasonCommands[0],
    summaryCommands[0]
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
export async function loadSeason() {
    const raw = await fs.readFile("season.json", "utf-8");
    return JSON.parse(raw);
}
export async function updateSeason(season) {
    await fs.writeFile("season.json", JSON.stringify(season, null, 2));
}
export async function updateBookings(bookings) {
    await fs.writeFile("bookings.json", JSON.stringify(bookings, null, 2));
}
export async function updateSummary(summary) {
    await fs.writeFile("summary.md", summary);
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
    else if (viewTrackCommands.includes(command)) {
        viewTrack();
    }
    else if (searchBookingCommands.includes(command)) {
        searchBooking();
    }
    else if (configSeasonCommands.includes(command)) {
        configSeason();
    }
    else if (summaryCommands.includes(command)) {
        summary();
    }
    else if (exitCommands.includes(command)) {
        console.log(dimmedText("\n~Exited~\n"));
        rl.close();
    }
    else if (command === 'help') {
        for (const helpCommand of helpCommands) {
            console.log(dimmedText(String(helpCommand)));
        }
        enterCommand();
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
    bookingText += displayMagPair("\nHut: ", booking.hut[0]?.toUpperCase() + booking.hut.slice(1));
    bookingText += displayMagPair("\nArrival Date: ", String(booking.arrivalDate));
    bookingText += displayMagPair("\nNights: ", String(booking.nights));
    bookingText += displayMagPair("\nParty Size: ", String(booking.partySize));
    bookingText += displayMagPair("\nMember: ", memberText);
    const price = booking.isMember ? memberCostPerNight : costPerNight;
    const net = booking.nights * price * booking.partySize;
    const savings = (booking.nights * costPerNight * booking.partySize) -
        (booking.nights * price * booking.partySize);
    const GST = net * 0.15;
    const gross = net + GST;
    bookingText += displayMagPair("\n\nNet: ", String("$" + net));
    bookingText += displayMagPair("\nSaving: ", String("$" + savings));
    bookingText += displayMagPair("\nGST: ", String("$" + GST));
    bookingText += displayMagPair("\nGross: ", String("$" + gross));
    console.log(bookingText += magentaText('\n---------------'));
}
export function closeRl() {
    rl.close();
}
enterCommand();
function viewTracks() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=commands.js.map