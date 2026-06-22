import { ask, displayBooking, enterCommand, loadBookings, loadHuts, loadSeason, saveNewBooking } from './commands.js';
import { dimmedText, blueText, errorText } from './logger.js';
import { displayHut } from './view-track.js';
let currentHut;
let season;
let highestCapacity = 0;
const validYesInput = ["yes", "y", "true", "t"];
const validNoInput = ["no", "n", "false", "f"];
export async function createNewBooking() {
    const tramperName = await getTramperName();
    const hut = await getHut();
    const arrivalDate = await getArrivalDate();
    const nights = await getNightsOfStay(arrivalDate);
    const partySize = await getPartySize(arrivalDate, nights);
    const isMember = Boolean(await getIsMember());
    const bookings = await loadBookings();
    const ids = bookings.map(b => Number(b.bookingId.slice(3))).sort((a, b) => a - b);
    let nextId = 1;
    for (const id of ids) {
        if (id === nextId) {
            nextId++;
        }
        else if (id > nextId) {
            break;
        }
    }
    const bookingId = `id_${nextId}`;
    const booking = {
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
    let tramperName = '';
    try {
        tramperName = await ask(blueText("Enter Tramper Name: "));
        if (tramperName.trim() === '') {
            throw new Error("Name cannot be empty");
        }
        tramperName = setPascalCaseText(tramperName);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        tramperName = await getTramperName();
    }
    return tramperName;
}
const setPascalCaseText = (text) => {
    const words = text.trim().toLowerCase().split(' ');
    return words.map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
};
async function getHut() {
    let hut = '';
    try {
        hut = await ask(blueText("Enter Hut: "));
        if (hut.trim() === '') {
            throw new Error("Hut cannot be empty");
        }
        const huts = await loadHuts();
        const matchingHut = huts.find(h => h.hutName === hut.toLowerCase());
        if (!matchingHut) {
            throw new Error("Hut was not found");
        }
        currentHut = matchingHut;
        hut = matchingHut.hutName;
        displayHut(matchingHut);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        hut = await getHut();
    }
    return hut;
}
async function getPartySize(arrivalDate, nightsOfStay) {
    let partySize = 0;
    // startA < endB AND startB < endA
    try {
        const partySizeInput = await ask(blueText("Enter Party Size: "));
        partySize = Number(partySizeInput.trim());
        if (Number.isNaN(partySize)) {
            throw new Error("Party Size is Not a Number");
        }
        else if (Number(partySize) <= 0) {
            throw new Error("Number must be greater than zero");
        }
        else if (!Number.isInteger(partySize)) {
            throw new Error("Number must be a whole number");
        }
        if (partySize > (currentHut.capacity - highestCapacity)) {
            throw new Error(`Party size exceeds hut capacity for some nights of stay, capacity free: ${currentHut.capacity - highestCapacity}`);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        partySize = await getPartySize(arrivalDate, nightsOfStay);
    }
    return partySize;
}
function getOverlapCapacity(bookings, arrivalDate) {
    let capacityTaken = 0;
    const endA = new Date(arrivalDate);
    endA.setDate(endA.getDate() + 1);
    for (const booking of bookings) {
        const startB = new Date(booking.arrivalDate);
        const endB = new Date(startB);
        endB.setDate(endB.getDate() + booking.nights);
        if (arrivalDate < endB && startB < endA) {
            // Overlapping dates add to capacityTaken
            capacityTaken += booking.partySize;
        }
    }
    return capacityTaken;
}
async function getArrivalDate() {
    let arrivalDate = new Date();
    try {
        const arrivalDateInput = (await ask(blueText("Enter Arrival Date (dd-mm-yyyy): ")))
            .trim();
        if (arrivalDateInput === "") {
            throw new Error("Date must not be empty");
        }
        const segments = arrivalDateInput.split('-');
        if (segments.find(s => Number.isNaN(Number(s)))) {
            throw new Error("Dates Must Be Numbers eg. 15-01-2026");
        }
        const day = Number(segments[0]);
        const month = Number(segments[1]);
        const year = Number(segments[2]);
        if (month > 12 || month < 1) {
            throw new Error("Month must be between 1-12");
        }
        const daysInMonth = Number(getDaysInMonth(year, month));
        if (day < 1 || day > daysInMonth) {
            throw new Error(`Day must be within days of month 1-${daysInMonth}`);
        }
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        if (year < currentYear) {
            throw new Error("Year must be in the future");
        }
        else if (month < currentMonth && year === currentYear) {
            throw new Error("Month must be in the future");
        }
        else if (day < currentDay && month === currentMonth && year === currentYear) {
            throw new Error("Day must be in the future");
        }
        season = await loadSeason();
        arrivalDate = new Date(year, month - 1, day);
        const startMonth = getMonthName(season.startMonth);
        const endMonth = getMonthName(season.endMonth);
        if (!(await checkDatesInSeason(arrivalDate))) {
            throw new Error(`Date must be in season range (${startMonth} -> ${endMonth})`);
        }
        const bookings = await loadBookings();
        let capacityTaken = 0;
        const matchingHutBookings = bookings.filter(b => b.hut === currentHut.hutName);
        capacityTaken = getOverlapCapacity(matchingHutBookings, arrivalDate);
        if (currentHut.capacity - capacityTaken === 0) {
            throw new Error("Hut is fully booked on this date");
        }
        console.log(dimmedText(`\nCapacity Remaining (${formatDate(arrivalDate)}): ${currentHut.capacity - capacityTaken}\n`));
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        arrivalDate = await getArrivalDate();
    }
    return arrivalDate;
}
function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
const getDaysInMonth = (year, month) => {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) {
        return 29;
    }
    return days[month - 1];
};
const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};
async function getNightsOfStay(arrivalDate) {
    let nightsOfStay = 0;
    try {
        const nightsOfStayInput = await ask(blueText("Enter Nights of Stay: "));
        if (Number.isNaN(Number(nightsOfStayInput))) {
            throw new Error("Nights of stay must be a number");
        }
        nightsOfStay = Number(nightsOfStayInput);
        if (nightsOfStay < 1 || nightsOfStay > 30) {
            throw new Error("Nights of stay must be between 1-30");
        }
        else if (!Number.isInteger(nightsOfStay)) {
            throw new Error("Number must be a whole number");
        }
        const endDate = new Date(arrivalDate);
        endDate.setDate(endDate.getDate() + nightsOfStay);
        const startMonth = getMonthName(season.startMonth);
        const endMonth = getMonthName(season.endMonth);
        if (!(await checkDatesInSeason(arrivalDate, endDate))) {
            throw new Error(`Date range must be within season (${startMonth} -> ${endMonth})`);
        }
        // iterate through each night of stay
        // check capacity taken for each
        // get the most capacity taken night and use it
        const bookings = await loadBookings();
        const matchingHutBookings = bookings.filter(b => b.hut === currentHut.hutName);
        highestCapacity = 0;
        const date = new Date(arrivalDate);
        for (let i = 0; i < nightsOfStay; i++) {
            date.setDate(date.getDate() + i);
            const value = getOverlapCapacity(matchingHutBookings, date);
            if (value > highestCapacity) {
                highestCapacity = value;
            }
        }
        console.log(dimmedText(`\nMax capacity for date and nights of stay: ${currentHut.capacity - highestCapacity}\n`));
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        nightsOfStay = await getNightsOfStay(arrivalDate);
    }
    return nightsOfStay;
}
function getMonthName(month) {
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
function getNights(start, end) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = end.getTime() - start.getTime();
    return Math.round(diffMs / msPerDay);
}
async function getIsMember() {
    let isMember = false;
    try {
        const isMemberInput = await ask(blueText("Is tramper member (y/n): "));
        if (isMemberInput.trim() === '') {
            throw new Error("Must not leave empty");
        }
        if (validYesInput.includes(isMemberInput.trim().toLowerCase())) {
            isMember = true;
        }
        else if (validNoInput.includes(isMemberInput.trim().toLowerCase())) {
            isMember = false;
        }
        else {
            throw new Error("Must be yes or no");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        isMember = await getIsMember();
    }
    return isMember;
}
async function confirmBooking(booking) {
    const confirmed = await ask(blueText("Confirm Booking (y/n): "));
    if (validYesInput.includes(confirmed.trim().toLowerCase())) {
        saveNewBooking(booking);
    }
    else if (validNoInput.includes(confirmed.trim().toLowerCase())) {
        console.log(dimmedText("\n~Booking not saved~\n"));
    }
    else {
        console.log(errorText("Must enter (y/n): "));
        await confirmBooking(booking);
    }
}
async function checkDatesInSeason(start, end) {
    season = await loadSeason();
    if (end === undefined) {
        end = new Date(start);
    }
    const startMonth = Math.min(season.startMonth, season.endMonth);
    const endMonth = Math.max(season.startMonth, season.endMonth);
    let inSeason = false;
    if (season.startMonth > season.endMonth) {
        inSeason = (start.getMonth() + 1 > startMonth) && (end.getMonth() + 1 < endMonth);
        return !inSeason;
    }
    else {
        inSeason = (start.getMonth() + 1 >= startMonth) && (end.getMonth() + 1 <= endMonth);
        return inSeason;
    }
    // console.log(start.getMonth());
    // console.log(end.getMonth());
    // const inSeason: boolean = (start.getMonth() + 1 >= startMonth) && (end.getMonth() + 1 <= endMonth);
    // if (season.startMonth > season.endMonth) {
    //     console.log("season reversed: " + !inSeason);
    //     return !inSeason;
    // } else {
    //     console.log("season: " + inSeason);
    //     return inSeason;
    // }
    // const year: number = start.getFullYear();
    // const seasonStartDate: Date = new Date(
    //     year,
    //     season.startMonth - 1,
    //     season.startDay
    // );
    // let endYear: number = year;
    // if (season.startMonth > season.endMonth || season.startDay > season.endDay) {
    //     endYear = year + 1;
    // }
    // const seasonEndDate: Date = new Date(
    //     endYear,
    //     season.endMonth - 1,
    //     season.endDay
    // );
    // console.log(start);
    // console.log(end);
    // console.log(seasonStartDate);
    // console.log(seasonEndDate);
    // if (start.getTime() === seasonEndDate.getTime()) {
    //     return false;
    // }
    // // startA >= startB && endA <= endB
    // if (start >= seasonStartDate && end <= seasonEndDate) {
    //     return true;
    // } else {
    //     return false;
    // }
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
//# sourceMappingURL=create-new-booking.js.map