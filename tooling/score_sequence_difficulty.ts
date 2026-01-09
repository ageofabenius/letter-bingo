import fs from 'fs';

const DEPTH = 25
const dictionary_filepath = "src/lib/content/wordle_la.txt"

let sequence_filepath = process.argv[2];

main(sequence_filepath, dictionary_filepath, DEPTH)


function main(sequence_filepath: string, dictionary_filepath: string, depth: number) {
    console.log(`Scoring sequence difficulty for: ${sequence_filepath}`)

    let dictionary = load_dictionary(dictionary_filepath)

    let word_list_with_counts: Word[] = [...dictionary].map((w) => {
        return { word: w, letter_count: word_letter_count(w) }
    })

    let sequence = load_sequence(sequence_filepath)
    console.log(`Sequence: ${sequence}`)

    for (let i = 5; i <= depth; i++) {
        let current_sequence = sequence.slice(0, i)

        let current_sequence_letter_count = word_letter_count(current_sequence)

        let words_in_sequence = word_list_with_counts.filter((w) =>
            letter_count_contains_other(current_sequence_letter_count, w.letter_count)
        )

        console.log(`length: ${String(current_sequence.length).padStart(2, " ")}, num_words_in_sequence: ${words_in_sequence.length}`)
    }
}

function load_dictionary(dictionary_filepath: string): Set<string> {
    console.log(`Loading dictionary: ${dictionary_filepath}`)

    let all_words = fs.readFileSync(dictionary_filepath, 'utf8').trimEnd().split('\n')

    let all_words_set = new Set(all_words)

    return all_words_set
}

function load_sequence(sequence_filepath: string): string {
    return fs.readFileSync(sequence_filepath, 'utf8').toLowerCase()
}

type LetterCount = number[]

function word_letter_count(word: string): LetterCount {
    let count: LetterCount = Array(26).fill(0)
    for (let i = 0; i < word.length; i++) {
        let index = word.charCodeAt(i) - 97 // 97 = a, this sets a = 0, b = 1, ....
        count[index]++
    }

    return count
}

type Word = {
    word: string,
    letter_count: LetterCount
}

function letter_count_contains_other(letter_count: LetterCount, other: LetterCount): boolean {
    for (let i = 0; i < 26; i++) {
        if (other[i] > letter_count[i]) {
            return false
        }
    }

    return true
}