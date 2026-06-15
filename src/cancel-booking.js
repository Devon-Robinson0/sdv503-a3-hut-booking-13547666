import { ask, displayBooking, enterCommand, loadBookings, updateBookings } from "./commands.js";
import { blueText, dimmedText, errorText } from "./logger.js";
let bookings = [];
let booking;
const validYesInput = ["yes", "y", "true", "t"];
const validNoInput = ["no", "n", "false", "f"];
export async function cancelBooking() {
    const booking = await getBookingById();
    displayBooking(booking);
    const confirmation = await getConfirmation();
    if (confirmation) {
        const updatedBookings = bookings.filter(b => b.bookingId !== booking.bookingId);
        updateBookings(updatedBookings);
    }
    enterCommand();
}
async function getConfirmation() {
    let confirmation = false;
    try {
        const confirmationInput = (await ask(blueText("\nWould you like to delete this booking? (y/n): ")))
            .trim()
            .toLowerCase();
        if (validNoInput.includes(confirmationInput)) {
            confirmation = false;
            console.log(dimmedText("\n~Booking Not Deleted~\n"));
        }
        else if (validYesInput.includes(confirmationInput)) {
            confirmation = true;
            console.log(dimmedText("\n~Booking Deleted~\n"));
        }
        else {
            throw new Error("Must answer (y/n): ");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        confirmation = await getConfirmation();
    }
    return confirmation;
}
async function getBookingById() {
    try {
        const bookingIdInput = await ask(blueText("Enter Booking ID: "));
        if (bookingIdInput.trim() === '') {
            throw new Error("ID must not be blank");
        }
        bookings = await loadBookings();
        const match = bookings.find(b => b.bookingId === bookingIdInput.trim().toLowerCase());
        if (match) {
            booking = match;
        }
        else {
            throw new Error("ID does not match any in database");
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(errorText(err.message));
        }
        else {
            console.log(err);
        }
        booking = await getBookingById();
    }
    return booking;
}
//# sourceMappingURL=cancel-booking.js.map