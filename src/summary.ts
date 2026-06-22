import { displayBooking, enterCommand, formatDate, getMonthName, loadBookings, loadHuts, loadSeason, updateSummary, type Booking, type Hut, type Season } from "./commands.js";
import { dimmedText } from "./logger.js";

export async function summary() {
    let summary: string = "<h1>OCCUPANCY SUMMARY REPORT<br>";
    summary += "========================</h1>";
    summary += `<h3>Date: ${formatDate(new Date())}</h3>`;

    const currentSeason: Season = await loadSeason();
    summary += `<b>Current Season Range:</b> ${getMonthName(currentSeason.startMonth)} -> ${getMonthName(currentSeason.endMonth)}<br>`;

    let totalPeople: number = 0;

    const huts: Hut[] = await loadHuts();
    const bookings: Booking[] = await loadBookings();
    for (const hut of huts) {
        summary += `<h3>${hut.hutName}:</h3>`;

        const matches = bookings.filter(b => b.hut === hut.hutName);

        if (matches.length === 0) {
            summary += "<br>~No Bookings~<br>";
        }

        matches.forEach(m => {
            const memberText = m.isMember ? 'yes' : 'no';

            summary += "<b>--- Booking ---</b><br>";
            summary += `<b>${m.bookingId}</b><br>`;
            summary += `<b>Tramper Name:</b> ${m.tramperName}<br>`;
            summary += `<b>Hut:</b> ${m.hut}<br>`;
            summary += `<b>Arrival Date:</b> ${formatDate(new Date(m.arrivalDate))}<br>`;
            summary += `<b>Nights of Stay:</b> ${m.nights}<br>`;
            summary += `<b>Party Size:</b> ${m.partySize}<br>`;
            summary += `<b>Is Member:</b> ${memberText}<br><br>`;
        });

        let people: number = 0;
        matches.forEach(m => {
            people += m.partySize;
        });

        summary += `<b>Total Booked People:</b> ${people}<br>`;
        totalPeople += people;
    }

    summary += `<b>Total People:</b> ${totalPeople}<br>`;

    updateSummary(summary);
    console.log(dimmedText("\n~Occupancy Summary Updated~\n"));

    enterCommand();
}