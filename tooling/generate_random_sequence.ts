import {
	RemainingLetterCount,
	SCRABBLE_LETTER_DISTRIBUTION
} from '../src/lib/components/letter_bag.svelte.ts';

let NUM_SEQUENCES = Number(process.argv[2]);

/**
 * Sequence included here for use without $state Svelte runes
 */
export class Sequence {
	/**
	 * An alternative to LetterRandomizer.  Sequence determines its sequence at
	 * initialization time, taking a sequence length (25 min to fill board).
	 * The resulting sequence is then exposed as this.bag, allowing for
	 * fine-tuning the number of additional tiles displayed.
	 */

	bag: RemainingLetterCount;

	// random_seed = 1234

	sequence: string[] = [];

	constructor(initial_bag: RemainingLetterCount, sequence_length: number) {
		this.sequence = this.generate_sequence(initial_bag, sequence_length);
		this.bag = this.bag_from_sequence(this.sequence);
	}

	generate_sequence(initial_bag: RemainingLetterCount, sequence_length: number): string[] {
		const bag_flattened = Object.entries(initial_bag).flatMap(([letter, count]) =>
			Array(count).fill(letter)
		);
		const sequence: string[] = [];
		for (let i = 0; i < sequence_length; i++) {
			const random_index = Math.floor(Math.random() * bag_flattened.length);
			const letter = bag_flattened.splice(random_index, 1)[0];
			sequence.push(letter);
		}
		return sequence;
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
			Z: 0
		};
		for (let letter of sequence) {
			// @ts-expect-error
			bag[letter] = (bag[letter] ?? 0) + 1;
		}
		return bag;
	}

	get_next_letter(): string {
		const letter = this.sequence.shift()!;

		this.bag[letter] -= 1;
		return letter;
	}
}

console.log(`id,sequence`);
for (let s = 0; s < NUM_SEQUENCES; s++) {
	let sequence = new Sequence(SCRABBLE_LETTER_DISTRIBUTION, 50);
	console.log(`${s},${sequence.sequence.join('')}`);
}
