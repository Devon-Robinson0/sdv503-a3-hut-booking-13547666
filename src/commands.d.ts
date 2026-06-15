export type Hut = {
    hutName: string;
    track: string;
    capacity: number;
};
export type Booking = {
    bookingId: string;
    tramperName: string;
    hut: string;
    arrivalDate: Date;
    nights: number;
    partySize: number;
    isMember: boolean;
};
export declare function ask(q: string): Promise<string>;
export declare function loadHuts(): Promise<Hut[]>;
export declare function loadBookings(): Promise<Booking[]>;
export declare function updateBookings(bookings: Booking[]): Promise<void>;
export declare function enterCommand(): Promise<void>;
export declare function saveNewBooking(booking: Booking): Promise<void>;
export declare function displayBooking(booking: Booking): Promise<void>;
export declare function closeRl(): void;
//# sourceMappingURL=commands.d.ts.map