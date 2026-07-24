// Generates a seat layout for a train, given a total seat count.
// Coaches are fixed at 8 seats each (typical AC-3 style layout), cycling
// through WINDOW / MIDDLE / AISLE positions. Returns plain objects — no
// trainId attached yet, since the caller decides which train they belong to.

const SEATS_PER_COACH = 8;

// Position pattern within a single 8-seat coach.
const SEAT_TYPE_PATTERN = [
  'WINDOW', 'MIDDLE', 'AISLE',
  'AISLE', 'MIDDLE', 'WINDOW',
  'WINDOW', 'AISLE'
];

function generateSeats(totalSeats) {
  const seats = [];

  for (let i = 0; i < totalSeats; i++) {
    const coachIndex = Math.floor(i / SEATS_PER_COACH) + 1; // 1-based coach number
    const seatInCoach = (i % SEATS_PER_COACH) + 1;           // 1-based seat number within the coach
    const type = SEAT_TYPE_PATTERN[i % SEAT_TYPE_PATTERN.length];

    seats.push({
      coach: `S${coachIndex}`,
      seatNumber: `${seatInCoach}`,
      type
    });
  }

  return seats;
}

export default generateSeats;
export { SEATS_PER_COACH };
