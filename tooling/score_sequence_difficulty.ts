import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const dictionary_filepath = 'src/lib/content/wordle_la.txt';

let input_csv = process.argv[2];
let output_csv = process.argv[3];

main(input_csv, dictionary_filepath, output_csv);

function main(sequence_filepath: string, dictionary_filepath: string, output_csv?: string) {
	console.log(`Scoring sequence difficulty for: ${sequence_filepath}`);

	let dictionary = load_dictionary(dictionary_filepath);

	let sequences = load_sequence_csv_file(sequence_filepath);

	let scored_sequences = sequences.slice(0, 100).map((s) => score_sequence(s, dictionary));
	console.log(scored_sequences);

	if (output_csv) {
		write_sequence_csv_file(output_csv, scored_sequences);
	}
}

function score_sequence(
	sequence: SequenceEntry,
	dictionary_with_word_letter_counts: Map<string, LetterCount>
): SequenceEntry {
	const lower_case_sequence = sequence.sequence.toLowerCase();

	let num_words_curve: number[] = [];
	for (let i = 0; i <= 25; i++) {
		let current_sequence = lower_case_sequence.slice(0, i);

		let current_sequence_letter_count = word_letter_count(current_sequence);

		let num_words_in_sequence = [...dictionary_with_word_letter_counts.values()].filter(
			(letter_count) => letter_count_contains_other(current_sequence_letter_count, letter_count)
		).length;
		num_words_curve.push(num_words_in_sequence);

		// console.log(
		// 	`length: ${String(current_sequence.length).padStart(2, ' ')}, num_words_in_sequence: ${num_words_in_sequence}`
		// );
	}

	sequence.num_words_curve = num_words_curve;

	return sequence;
}

function load_dictionary(dictionary_filepath: string): Map<string, LetterCount> {
	console.log(`Loading dictionary: ${dictionary_filepath}`);

	let word_list = fs.readFileSync(dictionary_filepath, 'utf8').trimEnd().split('\n');

	let word_list_with_letter_counts: Map<string, LetterCount> = new Map(
		[...word_list].map((w) => [w, word_letter_count(w)])
	);

	return word_list_with_letter_counts;
}

type SequenceEntry = {
	id: string;
	sequence: string;
	num_words_curve?: number[];
};

function load_sequence_csv_file(sequence_filepath: string): SequenceEntry[] {
	const text = fs.readFileSync(sequence_filepath, 'utf8');

	return parse(text, {
		columns: true, // header row → objects
		skip_empty_lines: true
	});
}

function write_sequence_csv_file(filepath: string, sequences: SequenceEntry[]) {
	const csv = stringify(sequences, {
		header: true
	});

	fs.writeFileSync(filepath, csv, 'utf8');
}

function load_sequence_file(sequence_filepath: string): string {
	return fs.readFileSync(sequence_filepath, 'utf8').toLowerCase();
}

type LetterCount = number[];

function word_letter_count(word: string): LetterCount {
	let count: LetterCount = Array(26).fill(0);
	for (let i = 0; i < word.length; i++) {
		let index = word.charCodeAt(i) - 97; // 97 = a, this sets a = 0, b = 1, ....
		count[index]++;
	}

	return count;
}

type Word = {
	word: string;
	letter_count: LetterCount;
};

function letter_count_contains_other(letter_count: LetterCount, other: LetterCount): boolean {
	for (let i = 0; i < 26; i++) {
		if (other[i] > letter_count[i]) {
			return false;
		}
	}

	return true;
}
