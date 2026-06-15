import readline from 'node:readline';
import fs from 'fs/promises';
import { createNewBooking } from './create-new-booking.js';
import { section, 
    topic, 
    dimmedText, 
    blueText, 
    magentaText, 
    errorText } from './logger.js';

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

const createNewBookingCommands = [
        "create",
        "createnewbooking",
        "create new booking"
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

async function enterCommand() {
    const command: string = await ask(blueText("Enter a command ('help' to see all commands): "));
    
    if (createNewBookingCommands.includes(command.toLowerCase().trim())) {
        promptNewBooking();
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

export function closeRl() {
    rl.close();
}
enterCommand();