class SM2 {
  private static readonly MINIMUM_EASINESS_FACTOR = 1.3;
  private static readonly INITIAL_EASINESS_FACTOR = 2.5;

  public static schedule(card: Flashcard, quality: number): Date {
    const interval = this.calculateInterval(card, quality);
    const currentDate = new Date();
    const nextReviewDate = new Date(currentDate.getTime() + interval);
    return nextReviewDate;
  }

  private static calculateInterval(card: Flashcard, quality: number): number {
    let interval: number;
    if (quality < 3) {
      card.repetitions = 0;
      interval = 0;
    } else if (card.repetitions === 0) {
      interval = 1;
    } else if (card.repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(card.interval * card.easiness);
    }

    card.easiness = this.calculateEasiness(card.easiness, quality);
    card.interval = interval;
    card.repetitions++;

    return interval;
  }

  private static calculateEasiness(easiness: number, quality: number): number {
    let newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEasiness < this.MINIMUM_EASINESS_FACTOR) {
      newEasiness = this.MINIMUM_EASINESS_FACTOR;
    }
    return newEasiness;
  }
}

class Flashcard {
  public repetitions: number;
  public easiness: number;
  public interval: number;

  constructor() {
    this.repetitions = 0;
    this.easiness = SM2.INITIAL_EASINESS_FACTOR;
    this.interval = 0;
  }
}

// Usage example
const card = new Flashcard();
const quality = 4; // User's response quality (0-5 scale)

const nextReviewDate = SM2.schedule(card, quality);
console.log(`Next review date: ${nextReviewDate}`);
