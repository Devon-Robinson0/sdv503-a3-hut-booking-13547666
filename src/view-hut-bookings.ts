import { ask, enterCommand, loadBookings, loadHuts, type Hut, type Booking, displayBooking } from './commands.js';
import { blueText, errorText } from './logger.js';

type DateRange = {
    startDate: Date,
    endDate: Date
};

export async function viewHutBookings() {
    const hut = await getHut();
    const dateRange: DateRange = await getDateRange();

    const bookings: Booking[] = await loadBookings();

    // startA < endB AND startB < endA
    const overlappingBookings: Booking[] = bookings.filter(b => {
        const startB = new Date(b.arrivalDate);

        const endB = new Date(startB);
        endB.setDate(endB.getDate() + b.nights);

        return (dateRange.startDate < endB && startB < dateRange.endDate && b.hut === hut);
    });

    for (const booking of overlappingBookings) {
        displayBooking(booking);
    }

    enterCommand();
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

async function getDateRange(): Promise<DateRange> {
    let range: DateRange = { startDate: new Date(), endDate: new Date() };

    try {
        const startDateInput: string = (await ask(blueText("Enter Date Range (dd-mm-yyyy -> dd-mm-yyyy): ")))
            .trim()
            .toLowerCase();

        if (startDateInput === '') {
            throw new Error("Date range must not be empty");
        }

        const dates: string[] = startDateInput.split('->');

        const currentDate = new Date();
        const currentDay: number = currentDate.getDate();
        const currentMonth: number = currentDate.getMonth() + 1;
        const currentYear: number = currentDate.getFullYear();

        for (const date of dates) {
            const segments: Array<string> = date.trim().split('-');

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

            if (year < currentYear) {
                throw new Error("Year must be in the future");
            } else if (month < currentMonth && year === currentYear) {
                throw new Error("Month must be in the future");
            } else if (day < currentDay && month === currentMonth && year === currentYear) {
                throw new Error("Day must be in the future");
            }
        }

        const start = dates[0]
            ?.trim()
            .split('-')
            .reverse()
            .join('-');
        const end = dates[1]
            ?.trim()
            .split('-')
            .reverse()
            .join('-');

        range.startDate = new Date(String(start));
        range.endDate = new Date(String(end));

    } catch(err) {
       if (err instanceof Error) {
            console.log(errorText(err.message));
        } else {
            console.log(err);
        } 

        range = await getDateRange();
    }

    return range;
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