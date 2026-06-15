import { ask, 
    closeRl,
    displayBooking,
    enterCommand,
    loadBookings,
    loadHuts,
    saveNewBooking } from './commands.js';
import { section, 
    topic, 
    dimmedText, 
    blueText, 
    magentaText, 
    errorText, 
    displayMagPair} from './logger.js';
import type { Hut } from './commands.js';
import type { Booking } from './commands.js';

let currentHut: Hut;

const validYesInput = ["yes", "y", "true", "t"];
const validNoInput = ["no", "n", "false", "f"];

export async function createNewBooking() {
    const tramperName: string = await getTramperName();
    const hut: string = await getHut();
    const arrivalDate: Date = await getArrivalDate();
    const nights: number = await getNightsOfStay();
    const partySize: number = await getPartySize(arrivalDate, nights);
    const isMember: boolean = Boolean(await getIsMember());

    const bookings: Booking[] = await loadBookings();

    const ids = bookings.map(b => Number(b.bookingId.slice(3))).sort((a, b) => a - b);

    let nextId = 1;

    for (const id of ids) {
        if (id === nextId) {
            nextId++;
        } else if (id > nextId) {
            break;
        }
    }

    const bookingId: string = `id_${nextId}`;

    const booking: Booking = {
        bookingId,
        tramperName,
        hut,
        arrivalDate,
        nights,
        partySize,
        isMember
    };

    displayBooking(booking);

    const confirmed = await confirmBooking(booking);

    enterCommand();
}

async function getTramperName() {
    let tramperName: string = '';

    try {
        tramperName = await ask(blueText("Enter Tramper Name: "));

        if (tramperName.trim() === '') {
            throw new Error("Name cannot be empty");
        }

        tramperName = setPascalCaseText(tramperName);
        
    } catch(err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        }

        tramperName = await getTramperName();
    }

    return tramperName;
}

const setPascalCaseText = (text: string) => {   
    const words = text.trim().toLowerCase().split(' ');
    return words.map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
}

async function getHut() {
    let hut: string = '';

    try {
        hut = await ask(blueText("Enter Hut: "));

        if (hut.trim() === '') {
            throw new Error("Hut cannot be empty");
        }

        const huts: Hut[] = await loadHuts();
        
        const matchingHut = huts.find(h => h.hutName === hut.toLowerCase());

        if (!matchingHut) {
            throw new Error("Hut was not found");
        }

        currentHut = matchingHut;

        hut = matchingHut.hutName;

    } catch(err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        }

        hut = await getHut();
    }

    return hut;
}

async function getPartySize(arrivalDate: Date, nightsOfStay: number) {
    let partySize: number = 0;

    // startA < endB AND startB < endA

    try {
        const partySizeInput = await ask(blueText("Enter Party Size: "));
        partySize = Number(partySizeInput.trim());

        if (Number.isNaN(partySize)) {
            throw new Error("Party Size is Not a Number");
        }

        const bookings: Array<Booking> = await loadBookings();

        let capacityTaken: number = 0;

        for (const booking of bookings) {
            const startB = new Date(booking.arrivalDate);

            const endB = new Date(startB);
            endB.setDate(endB.getDate() + booking.nights);

            const endA = new Date(arrivalDate);
            endA.setDate(endA.getDate() + nightsOfStay);

            if (arrivalDate < endB && startB < endA) {
                // Overlapping dates add to capacityTaken
                capacityTaken += booking.partySize;
            }
        }

        if (partySize + capacityTaken > currentHut.capacity) {
            throw new Error(`Party size exceeds hut capacity for some nights of stay, capacity free: ${currentHut.capacity - capacityTaken}`);
        }

    } catch(err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        }

        partySize = await getPartySize(arrivalDate, nightsOfStay);
    }

    return partySize;
}

async function getArrivalDate() {
    let arrivalDate: Date = new Date();

    try {
        const arrivalDateInput = await ask(blueText("Enter Arrival Date (dd-mm-yyyy): "));

        if (arrivalDateInput.trim() === "") {
            throw new Error("Date must not be empty");
        }

        const segments: Array<string> = arrivalDateInput.split('-');
        if (segments.find(s => Number.isNaN(Number(s)))) {
            throw new Error("Dates Must Be Numbers eg. 15-01-2026");
        }

        const day: number = Number(segments[0]);
        const month: number = Number(segments[1]);
        const year: number = Number(segments[2]);
        
        if (month > 12 || month < 1) {
            throw new Error("Month must be between 1-12");
        }

        const daysInMonth: number = Number(getDaysInMonth(year, month));
        if (day < 1 || day > daysInMonth) {
            throw new Error(`Day must be within days of month 1-${daysInMonth}`);
        }

        const currentDate = new Date();
        const currentDay: number = currentDate.getDate();
        const currentMonth: number = currentDate.getMonth() + 1;
        const currentYear: number = currentDate.getFullYear();

        if (year < currentYear) {
            throw new Error("Year must be in the future");
        } else if (month < currentMonth && year === currentYear) {
            throw new Error("Month must be in the future");
        } else if (day < currentDay && month === currentMonth && year === currentYear) {
            throw new Error("Day must be in the future");
        }

        arrivalDate = new Date(`${year}-${month}-${day}`);

    } catch(err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        }

        arrivalDate = await getArrivalDate();
    }

    return arrivalDate;
}

const getDaysInMonth = (year: number, month: number) => {
    const days: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2 && isLeapYear(year)) {
        return 29;
    }

    return days[month - 1];
}

const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

async function getNightsOfStay() {
    let nightsOfStay: number = 0;

    try {
        const nightsOfStayInput: string = await ask(blueText("Enter Nights of Stay: "));

        if (Number.isNaN(Number(nightsOfStayInput))) {
            throw new Error("Nights of stay must be a number");
        }

        nightsOfStay = Number(nightsOfStayInput);
        if (nightsOfStay === 0 || nightsOfStay > 30) {
            throw new Error("Nights of stay must be between 1-30");
        }

    } catch(err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        }

        nightsOfStay = await getNightsOfStay();
    }

    return nightsOfStay;
}

async function getIsMember(): Promise<boolean> {
    let isMember = false;

    try {
        const isMemberInput: string = await ask(blueText("Is tramper member (y/n): "));

        if (isMemberInput.trim() === '') {
            throw new Error("Must not leave empty");
        }

        if (validYesInput.includes(isMemberInput.trim().toLowerCase())) {
            isMember = true;
        } else if (validNoInput.includes(isMemberInput.trim().toLowerCase())) {
            isMember = false;
        } else {
            throw new Error("Must be yes or no");
        }
        
    } catch(err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        }

        isMember = await getIsMember();
    }

    return isMember;
}

async function confirmBooking(booking: Booking) {
    const confirmed = await ask(blueText("Confirm Booking (y/n): "));

    if (validYesInput.includes(confirmed.trim().toLowerCase())) {
        saveNewBooking(booking);
    } else if (validNoInput.includes(confirmed.trim().toLowerCase())) {
        console.log(dimmedText("\n~Booking not saved~\n"));
    } else {
        console.log(errorText("Must enter (y/n): "));
        await confirmBooking(booking);
    }
}

// const exitCommands = [
//     "exit",
//     "cancel",
//     "quit"
// ];

// function shouldExit(text: string) {
//     if (exitCommands.includes(text.toLowerCase().trim())){
//         enterCommand();
//     }
// }