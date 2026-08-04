
const SEATS_PER_COACH = 8;

const SEAT_TYPE_PATTERN = [
  'WINDOW', 'MIDDLE', 'AISLE',
  'AISLE', 'MIDDLE', 'WINDOW',
  'WINDOW', 'AISLE'
];

function generateSeats(totalSeats) {
  const seats = [];

  for (let i = 0; i < totalSeats; i++) {
    const coachIndex = Math.floor(i / SEATS_PER_COACH) + 1;
    const seatInCoach = (i % SEATS_PER_COACH) + 1;
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
