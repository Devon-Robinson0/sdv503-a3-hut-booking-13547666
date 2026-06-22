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
export type Season = {
    startMonth: number;
    endMonth: number;
};
export declare const exitCommands: string[];
export declare function ask(q: string): Promise<string>;
export declare function loadHuts(): Promise<Hut[]>;
export declare function loadBookings(): Promise<Booking[]>;
export declare function loadSeason(): Promise<Season>;
export declare function updateSeason(season: Season): Promise<void>;
export declare function updateBookings(bookings: Booking[]): Promise<void>;
export declare function updateSummary(summary: string): Promise<void>;
export declare function enterCommand(): Promise<void>;
export declare function saveNewBooking(booking: Booking): Promise<void>;
export declare function displayBooking(booking: Booking): Promise<void>;
export declare function formatDate(date: Date): string;
export declare function getMonthName(month: number): string;
export declare function closeRl(): void;
//# sourceMappingURL=commands.d.ts.map