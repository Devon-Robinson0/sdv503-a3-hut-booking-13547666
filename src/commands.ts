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

let bookings: Booking[] = [];

const exitCommands = [
    "exit",
    "quit"
]

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

export async function updateBookings(bookings: Booking[]) {
    await fs.writeFile("bookings.json", JSON.stringify(bookings, null, 2));
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
    } else if (exitCommands.includes(command)) {
        rl.close();
    } else {
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