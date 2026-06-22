import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { dimmedText, 
    blueText, 
    magentaText, 
    displayMagPair, 
    errorText} from './logger.js';
import { cancelBooking } from './cancel-booking.js';
import { viewHutBookings } from './view-hut-bookings.js';
import { searchBooking } from './search-booking.js';
import { configSeason } from './config-season.js';
import { generateSummary } from './summary.js';
import { viewTrack } from './view-track.js';
import { testFiles } from './test-file.js';

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

const costPerNight = 15;
const memberCostPerNight = 12;

export const exitCommands: string[] = [
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
    "summary",
    "sum"
];

const viewTrackCommands: string[] = [
    "view track",
    "viewtrack",
    "track"
];

const testFileCommands: string[] = [
    "test file",
    "testfile",
    "test",
    "file"
]

const helpCommands = [
    exitCommands[0],
    createNewBookingCommands[0],
    cancelBookingCommands[0],
    viewHutBookingCommands[0],
    viewTrackCommands[0],
    searchBookingCommands[0],
    configSeasonCommands[0],
    summaryCommands[0],
    testFileCommands[0]
];

const autofillCommands: string[] = [
    ...exitCommands,
    ...createNewBookingCommands,
    ...cancelBookingCommands,
    ...viewHutBookingCommands,
    ...searchBookingCommands,
    ...configSeasonCommands,
    ...summaryCommands,
    ...testFileCommands,
    "help"
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line: string) => {
        const hits = autofillCommands.filter(c => c.startsWith(line));

        return [hits.length ? hits : autofillCommands, line];
    }
});

export function ask(q: string): Promise<string> {
    return new Promise(resolve => rl.question(q, resolve));
}

export async function loadHuts(): Promise<Hut[]> {
    const raw = await fs.readFile("./src/huts.json", "utf-8");
    return JSON.parse(raw);
}

export async function loadBookings(): Promise<Booking[]> {
    const raw = await fs.readFile("./src/bookings.json", "utf-8");
    return JSON.parse(raw);
}

export async function loadSeason(): Promise<Season> {
    const raw = await fs.readFile("./src/season.json", "utf-8");
    return JSON.parse(raw);
}

export async function updateSeason(season: Season) {
    await fs.writeFile("./src/season.json", JSON.stringify(season, null, 2));
}

export async function updateBookings(bookings: Booking[]) {
    await fs.writeFile("./src/bookings.json", JSON.stringify(bookings, null, 2));
}

export async function updateSummary(summary: string) {
    await fs.writeFile("./summary.md", summary);
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
    } else if (viewTrackCommands.includes(command)) {
        viewTrack();
    } else if (searchBookingCommands.includes(command)) {
        searchBooking();
    } else if (configSeasonCommands.includes(command)) {
        configSeason();
    } else if (summaryCommands.includes(command)) {
        generateSummary();
    } else if (testFileCommands.includes(command)) {
        testFiles();
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
    bookingText += displayMagPair("\nHut: ", booking.hut[0]?.toUpperCase() + booking.hut.slice(1));
    bookingText += displayMagPair("\nArrival Date: ", String(formatDate(new Date(booking.arrivalDate))));
    bookingText += displayMagPair("\nNights: ", String(booking.nights));
    bookingText += displayMagPair("\nParty Size: ", String(booking.partySize));
    bookingText += displayMagPair("\nMember: ", memberText);

    const price = booking.isMember ? memberCostPerNight : costPerNight;
    const net: number = booking.nights * price * booking.partySize;
    const savings: number = (booking.nights * costPerNight * booking.partySize) - 
        (booking.nights * price * booking.partySize);
    const GST: number = net * 0.15;
    const gross: number = net + GST;

    bookingText += displayMagPair("\n\nNet: ", String("$" + net));
    bookingText += displayMagPair("\nSaving: ",String("$" + savings));
    bookingText += displayMagPair("\nGST: ", String("$" + GST.toFixed(2)));
    bookingText += displayMagPair("\nGross: ", String("$" + gross));

    console.log(bookingText += magentaText('\n---------------'));
}

export function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const monthName = getMonthName(month);

    return `${day}-${monthName}-${year}`;
}

export function getMonthName(month: number): string {
    let monthName: string = "";

    switch (month) {
        case 1:
            monthName = "Jan";
            break;
        case 2:
            monthName = "Feb"
            break;
        case 3:
            monthName = "Mar";
            break;
        case 4:
            monthName = "Apr"
            break;
        case 5:
            monthName = "May";
            break;
        case 6:
            monthName = "Jun"
            break;
        case 7:
            monthName = "Jul"
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
