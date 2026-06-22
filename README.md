# sdv503-a3-hut-booking-13547666

## How To Run
- use "npm run manager" to run the hut manager
- you will be opened into an enter command line

## Valid Commands (from "Enter a Command" page)
**There are also alternitives/ shorthands to each of these to view every one press tab twice**
**Also pressing tab will autocorrect/fill what you are typing eg. "tes" -> "test"**
- create new booking
- cancel booking
- view hut booking
- view track
- search booking
- config season
- summary
- test file
- exit

## Create Booking
- run the manager
- enter "create new booking"
- enter a valid tramper name
- enter a valid hut (To view all valid huts, see view track command)
- enter a valid arrival date in dd-mm-yyyy format
- enter a valid nights of stay
- enter a valid party size
- enter membership status (yes/no)
- confirm the booking

## Cancel Booking
- run the manager
- enter "cancel booking"
- enter a valid booking id (To view all bookings and IDs, see search command)
- confirm deletion

## View Hut Booking
**Allows you to view all bookings for a given hut across a given time period, very useful for checking availability before booking**
- run the manager
- enter "view hut booking"
- enter a valid hut (To view all valid huts, see view track command)
- enter a valid date range like dd-mm-yyyy -> dd-mm-yyyy

## View Track
**Allows you to see all huts along a certain track, as well as all huts in general**
- run the manager
- enter "view track"
- enter a valid track, OR just enter nothing to see ALL tracks and their huts
- (tracks will autofill, eg. type "able" and press enter and able tasman coast track will show with its huts)

## Search Booking
**Allows you to search for a booking by name or see every booking**
- run the manager
- enter "search booking"
- enter a valid tramper name, OR enter nothing to see all bookings
- (Search functionality is based on simularity from start of name, E.G. entering "do" will show bookings for "doug", "doug smithers" if they exist)

## Config Season
**Allows you to change the season from month to month**
- run the manager
- enter "config season"
- enter valid range (e.g. aug -> jun)

## Summary
**Generates a summary of all bookings sorted by huts**
- run the manager
- enter "summary"
- open summary.md to view (file is automatically exported, file is stored outside src)

## Test File
**This command automatically runs tests on all data files to ensure data is not corrupted**
- run the manager
- enter "test file"
- an error may require you to fix manually (Of course there should be none)

## Exit
- when running the manager "enter a command" page
- enter "exit" to exit the application