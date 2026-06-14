import readline from 'node:readline';
import { createNewBooking } from './create-new-booking.js';
import { section, 
    topic, 
    dimmedText, 
    blueText, 
    magentaText, 
    errorText } from './logger.js';

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

async function enterCommand() {
    const command: string = await ask(blueText("Enter a command ('help' to see all commands): "));
    
    if (createNewBookingCommands.includes(command.toLowerCase().trim())) {
        promptNewBooking();
    }
   
}

async function promptNewBooking() {
    // const tramperName: string = await ask(blueText("Enter tramper name: "));
    // const hut: string = await ask(blueText("Enter hut: "));
    // const partySize: string = await ask(blueText("Enter party size: "));
    // const arrivalDate: string = await ask(blueText("Enter arrival date: "));
    // const nightsOfStay: string = await ask(blueText("Enter nights of stay: "));
    // const isMember: string = await ask(blueText("Are you a member? (y/n): "));

    createNewBooking();
}

export function closeRl() {
    rl.close();
}
enterCommand();