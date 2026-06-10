import readline from 'node:readline';

const createNewBookingCommands = [
        "create",
        "createnewbooking",
        "create new booking"
    ];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(q: string): Promise<string> {
    return new Promise(resolve => rl.question(q, resolve));
}

async function EnterCommand() {
    const command: string = await ask("Enter a command ('help' to see all commands): ");
    
    if (createNewBookingCommands.includes(command.toLowerCase().trim())) {
        promptNewBooking();
    }
   
}

async function promptNewBooking() {
    const tramperName: string = await ask("Enter tramper name: ");
}
