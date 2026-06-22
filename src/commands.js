import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { dimmedText, blueText, magentaText, displayMagPair, errorText } from './logger.js';
import { cancelBooking } from './cancel-booking.js';
import { viewHutBookings } from './view-hut-bookings.js';
import { searchBooking } from './search-booking.js';
import { configSeason } from './config-season.js';
import { summary } from './summary.js';
import { viewTrack } from './view-track.js';
const costPerNight = 15;
const memberCostPerNight = 12;
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
    "summary",
    "sum"
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
const autofillCommands = [
    ...exitCommands,
    ...createNewBookingCommands,
    ...cancelBookingCommands,
    ...viewHutBookingCommands,
    ...searchBookingCommands,
    ...configSeasonCommands,
    ...summaryCommands,
    "help"
];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line) => {
        const hits = autofillCommands.filter(c => c.startsWith(line));
        return [hits.length ? hits : autofillCommands, line];
    }
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
    try {
        await loadBookings();
    }
    catch (err) {
        console.log(errorText("Bookings data file is corrupt, fix before continuing"));
    }
    try {
        await loadHuts();
    }
    catch (err) {
        console.log(errorText("Huts data file is corrupt, fix before continuing"));
    }
    try {
        await loadSeason();
    }
    catch (err) {
        console.log(errorText("Season data file is corrupt, fix before continuing"));
    }
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
    bookingText += displayMagPair("\nArrival Date: ", String(formatDate(new Date(booking.arrivalDate))));
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
    bookingText += displayMagPair("\nGST: ", String("$" + GST.toFixed(2)));
    bookingText += displayMagPair("\nGross: ", String("$" + gross));
    console.log(bookingText += magentaText('\n---------------'));
}
export function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthName = getMonthName(month);
    return `${day}-${monthName}-${year}`;
}
export function getMonthName(month) {
    let monthName = "";
    switch (month) {
        case 1:
            monthName = "Jan";
            break;
        case 2:
            monthName = "Feb";
            break;
        case 3:
            monthName = "Mar";
            break;
        case 4:
            monthName = "Apr";
            break;
        case 5:
            monthName = "May";
            break;
        case 6:
            monthName = "Jun";
            break;
        case 7:
            monthName = "Jul";
            break;
        case 8:
            monthName = "Aug";
            break;
        case 9:
            monthName = "Sep";
            break;
        case 10:
            monthName = "Oct";
            break;
        case 11:
            monthName = "Nov";
            break;
        case 12:
            monthName = "Dec";
            break;
        default:
            monthName = "Not Found";
            break;
    }
    return monthName;
}
export function closeRl() {
    rl.close();
}
enterCommand();
//# sourceMappingURL=commands.js.map