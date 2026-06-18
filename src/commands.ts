import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { section, 
    topic, 
    dimmedText, 
    blueText, 
    magentaText, 
    errorText,
    displayMagPair } from './logger.js';
import { cancelBooking } from './cancel-booking.js';
import { viewHutBookings } from './view-hut-bookings.js';
import { searchBooking } from './search-booking.js';
import { configSeason } from './config-season.js';
import { summary } from './summary.js';

export type Hut = {
    hutName: string,
    track: string,
    capacity: number
}

export type Booking = {
    bookingId: string,
    tramperName: string,
    hut: string,
    arrivalDate: Date,
    nights: number,
    partySize: number,
    isMember: boolean
}

export type Season = {
    startMonth: number,
    endMonth: number
};

let bookings: Booking[] = [];

const exitCommands: string[] = [
    "exit",
    "quit"
]

const createNewBookingCommands: string[] = [
    "create new booking",
    "createnewbooking",
    "create"
];

const cancelBookingCommands: string[] = [
    "cancel booking",
    "cancelbooking",
    "cancel"
];

const viewHutBookingCommands: string[] = [
    "view hut booking",
    "viewhutbooking",
    "view"
];

const searchBookingCommands: string[] = [
    "search booking",
    "searchbooking",
    "search"
];

const configSeasonCommands: string[] = [
    "config season",
    "configseason",
    "config",
    "season"
];

const summaryCommands: string[] = [
    "summary"
];

const helpCommands = [
    exitCommands[0],
    createNewBookingCommands[0],
    cancelBookingCommands[0],
    viewHutBookingCommands[0],
    searchBookingCommands[0],
    configSeasonCommands[0],
    summaryCommands[0]
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function ask(q: string): Promise<string> {
    return new Promise(resolve => rl.question(q, resolve));
}

export async function loadHuts(): Promise<Hut[]> {
    const raw = await fs.readFile("huts.json", "utf-8");
    return JSON.parse(raw);
}

export async function loadBookings(): Promise<Booking[]> {
    const raw = await fs.readFile("bookings.json", "utf-8");
    return JSON.parse(raw);
}

export async function loadSeason(): Promise<Season> {
    const raw = await fs.readFile("season.json", "utf-8");
    return JSON.parse(raw);
}

export async function updateSeason(season: Season) {
    await fs.writeFile("season.json", JSON.stringify(season, null, 2));
}

export async function updateBookings(bookings: Booking[]) {
    await fs.writeFile("bookings.json", JSON.stringify(bookings, null, 2));
}

export async function updateSummary(summary: string) {
    await fs.writeFile("summary.md", summary);
}

export async function enterCommand() {
    const command: string = (await ask(blueText("Enter a command ('help' to see all commands): ")))
        .trim()
        .toLowerCase();
    
    if (createNewBookingCommands.includes(command)) {
        promptNewBooking();
    } else if (cancelBookingCommands.includes(command)) {
        cancelBooking();
    } else if (viewHutBookingCommands.includes(command)) {
        viewHutBookings();
    } else if (searchBookingCommands.includes(command)) {
        searchBooking();
    } else if (configSeasonCommands.includes(command)) {
        configSeason();
    } else if (summaryCommands.includes(command)) {
        summary();
    } else if (exitCommands.includes(command)) {
        console.log(dimmedText("\n~Exited~\n"));
        rl.close();
    } else if (command === 'help') {
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

export async function saveNewBooking(booking: Booking) {
    const currentBookings = await loadBookings();

    currentBookings.push(booking);

    await fs.writeFile('bookings.json', JSON.stringify(currentBookings, null, 2));
}

export async function displayBooking(booking: Booking) {
    let bookingText: string = magentaText('\n--- Booking ---');
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