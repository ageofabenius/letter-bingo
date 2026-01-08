export class LetterRandomizer {
    initial_letter_distribution: LetterBag = {
        A: 9,
        B: 2,
        C: 2,
        D: 4,
        E: 12,
        F: 2,
        G: 3,
        H: 2,
        I: 9,
        J: 1,
        K: 1,
        L: 4,
        M: 2,
        N: 6,
        O: 8,
        P: 2,
        Q: 1,
        R: 6,
        S: 4,
        T: 6,
        U: 4,
        V: 2,
        W: 2,
        X: 1,
        Y: 2,
        Z: 1,
    }

    bag: LetterBag

    // random_seed = 1234

    constructor() {
        this.bag = { ...this.initial_letter_distribution }
        console.log('initialized letter bag', this.bag)
    }

    get_next_letter(): string {
        const bag_flattened = Object.entries(this.bag).flatMap(([letter, count]) => Array(count).fill(letter));
        const letter = bag_flattened[Math.floor(Math.random() * bag_flattened.length)]
        this.bag[letter] -= 1
        return letter
    }
}

export type LetterBag = Record<string, number>