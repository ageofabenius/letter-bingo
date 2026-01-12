export interface LetterSequencer {
    bag:RemainingLetterCount

    get_next_letter(): string
}

export type RemainingLetterCount = Record<string, number>

export class ScrabbleBag implements LetterSequencer {
    initial_letter_distribution: RemainingLetterCount = {
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

    bag: RemainingLetterCount

    // random_seed = 1234

    constructor() {
        this.bag = $state({ ...this.initial_letter_distribution })
        console.log('initialized letter bag', this.bag)
    }

    get_next_letter(): string {
        const bag_flattened = Object.entries(this.bag).flatMap(([letter, count]) => Array(count).fill(letter));
        const letter = bag_flattened[Math.floor(Math.random() * bag_flattened.length)]
        this.bag[letter] = this.bag[letter] - 1
        return letter
    }
}


const SCRABBLE_LETTER_DISTRIBUTION: RemainingLetterCount = {
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

const HALFISH_SCRABBLE_LETTER_DISTRIBUTION: RemainingLetterCount = {
    A: 4,
    B: 1,
    C: 1,
    D: 2,
    E: 5,
    F: 1,
    G: 2,
    H: 1,
    I: 4,
    J: 1,
    K: 1,
    L: 2,
    M: 1,
    N: 3,
    O: 4,
    P: 1,
    Q: 1,
    R: 3,
    S: 2,
    T: 3,
    U: 2,
    V: 1,
    W: 1,
    X: 1,
    Y: 1,
    Z: 1,
}


export class Sequence implements LetterSequencer {
    /**
     * An alternative to LetterRandomizer.  Sequence determines its sequence at
     * initialization time, taking a sequence length (25 min to fill board).
     * The resulting sequence is then exposed as this.bag, allowing for
     * fine-tuning the number of additional tiles displayed.
     */
    
    bag: RemainingLetterCount

    // random_seed = 1234

    sequence: string[] = []

    constructor(sequence_length: number) {
        this.sequence = this.generate_sequence(sequence_length)
        this.bag = $state(this.bag_from_sequence(this.sequence))
        console.log('initialized letter bag', this.bag)

        // console.log('number letters', Object.values(HALFISH_SCRABBLE_LETTER_DISTRIBUTION).reduce((acc, cur) => acc += cur, 0))
    }

    generate_sequence(sequence_length: number): string[] {
        const bag_flattened = Object.entries(HALFISH_SCRABBLE_LETTER_DISTRIBUTION).flatMap(([letter, count]) => Array(count).fill(letter));
        const sequence: string[] = []
        for (let i = 0; i < sequence_length; i++) {
            const random_index = Math.floor(Math.random() * bag_flattened.length)
            const letter = bag_flattened.splice(random_index, 1)[0]
            sequence.push(letter)
        }
        return sequence
    }

    bag_from_sequence(sequence: string[]): RemainingLetterCount {
        const bag = {
            A: 0,
            B: 0,
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            G: 0,
            H: 0,
            I: 0,
            J: 0,
            K: 0,
            L: 0,
            M: 0,
            N: 0,
            O: 0,
            P: 0,
            Q: 0,
            R: 0,
            S: 0,
            T: 0,
            U: 0,
            V: 0,
            W: 0,
            X: 0,
            Y: 0,
            Z: 0,
        }
        for (let letter of sequence) {
            // @ts-expect-error
            bag[letter] = (bag[letter] ?? 0) + 1;
        }
        return bag
    }

    get_next_letter(): string {
        const letter = this.sequence.shift()!

        this.bag[letter] -= 1
        return letter
    }
}

