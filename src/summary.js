import { displayBooking, enterCommand, loadBookings, loadHuts, loadSeason, updateSummary } from "./commands.js";
import { dimmedText } from "./logger.js";
export async function summary() {
    let summary = "<h1>OCCUPANCY SUMMARY REPORT<br>";
    summary += "========================</h1>";
    summary += `<h3>Date: ${formatDate(new Date())}</h3>`;
    const currentSeason = await loadSeason();
    summary += `<b>Current Season Range:</b> ${getMonthName(currentSeason.startMonth)} -> ${getMonthName(currentSeason.endMonth)}<br>`;
    let totalPeople = 0;
    const huts = await loadHuts();
    const bookings = await loadBookings();
    for (const hut of huts) {
        summary += `<b>${hut.hutName}:</b>`;
        const matches = bookings.filter(b => b.hut === hut.hutName);
        if (matches.length === 0) {
            summary += "<br>~No Bookings~<br>";
        }
        matches.forEach(m => {
            const memberText = m.isMember ? 'yes' : 'no';
            summary += "<br><b>=== Booking ===</b><br>";
            summary += `<b>${m.bookingId}</b><br>`;
            summary += `<b>Tramper Name:</b> ${m.tramperName}<br>`;
            summary += `<b>Hut:</b> ${m.hut}<br>`;
            summary += `<b>Arrival Date:</b> ${formatDate(new Date(m.arrivalDate))}<br>`;
            summary += `<b>Nights of Stay:</b> ${m.nights}<br>`;
            summary += `<b>Party Size:</b> ${m.partySize}<br>`;
            summary += `<b>Is Member:</b> ${memberText}<br><br>`;
        });
        let people = 0;
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
function formatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const monthName = getMonthName(month);
    return `${day}-${monthName}-${year}`;
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
//# sourceMappingURL=summary.js.map