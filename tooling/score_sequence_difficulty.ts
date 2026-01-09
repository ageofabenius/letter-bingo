import fs from 'fs';

// [index][letter]
type WordMasks = Record<number, Record<string, bigint>>

function dictionary_and_word_masks(dictionary_filepath: string): [Set<string>, WordMasks, bigint] {
    console.log(`Loading dictionary: ${dictionary_filepath}`)

    let all_words = fs.readFileSync(dictionary_filepath, 'utf8').trimEnd().split('\n')

    let all_words_set = new Set(all_words)

    const letters = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ]

    let word_masks: WordMasks = {}
    for (let i = 0; i < 5; i++) {
        word_masks[i] = {}
        for (let letter of letters) {
            word_masks[i][letter] = 0n
        }
    }

    for (let [word_index, word] of all_words.entries()) {
        for (let pos = 0; pos < 5; pos++) {
            let letter = word[pos]
            word_masks[pos][letter] |= 1n << BigInt(word_index);
        }
    }

    const all_words_mask = (1n << BigInt(all_words.length)) - 1n;

    return [all_words_set, word_masks, all_words_mask]
}

class MatchChecker {
    word_masks: WordMasks
    all_words_mask: bigint

    memoized_num_matches: Map<string, number> = new Map()

    stats: Stats

    constructor(word_masks: WordMasks, all_words_mask: bigint, stats: Stats) {
        this.word_masks = word_masks
        this.all_words_mask = all_words_mask
        this.stats = stats
    }

    memoized_number_of_matches(letters: (string | null)[]): number {
        const letters_string = letters.join()
        const memoized = this.memoized_num_matches.get(letters_string)
        if (memoized !== undefined) {
            // console.log(`returning memoized: ${letters}`)
            this.stats.memoized_matches_returned++
            return memoized
        }

        this.stats.unmemoized_matches_returned++
        const num_matches = number_of_matches(letters, this.word_masks, this.all_words_mask)
        this.memoized_num_matches.set(letters_string, num_matches)
        // console.log(`memoizing ${letters}`)
        return num_matches
    }
}

function number_of_matches(letters: (string | null)[], word_masks: WordMasks, all_words_mask: bigint): number {
    let candidates = all_words_mask
    for (const [index, letter] of letters.entries()) {
        if (letter === null) {
            continue
        }
        candidates &= word_masks[index][letter]
    }

    // FOR NOW JUST RETURN 0 OR 1
    if (candidates === 0n) {
        return 0
    } else {
        return 1
    }
}

function load_sequence(sequence_filepath: string): string {
    return fs.readFileSync(sequence_filepath, 'utf8').toLowerCase()
}

function clone_board(board: (string | null)[][]): (string | null)[][] {
    return board.map(row => row.slice())
}

function main(sequence_filepath: string, dictionary_filepath: string) {
    console.log(`Scoring sequence difficulty for: ${sequence_filepath}`)

    let [dictionary, word_masks, all_words_mask] = dictionary_and_word_masks(dictionary_filepath)

    let sequence = load_sequence(sequence_filepath)
    console.log(`Sequence: ${sequence}`)

    console.log(`Simulating game....`)

    let game_board: (string | null)[][] = [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]
    let stats = new Stats()
    let match_checker = new MatchChecker(word_masks, all_words_mask, stats)
    recursive_foo(game_board, sequence, 0, 6, dictionary, match_checker, stats)
    stats.complete()
    stats.print_results()
}

function get_row(index: number, game_board: (string | null)[][]): (string | null)[] {
    return game_board[index]
}

function get_col(index: number, game_board: (string | null)[][]): (string | null)[] {
    return game_board.map((r) => r[index])
}

class Stats {
    total_possible_states: number
    visited_states: number = 0
    pruned_branches: number = 0
    pruned_states: number = 0
    winning_states: number = 0
    winning_boards: (string | null)[][][] = []

    start_time: number
    end_time: number | null = null

    memoized_matches_returned: number = 0
    unmemoized_matches_returned: number = 0

    constructor() {
        this.total_possible_states = factorial(25)
        this.start_time = Date.now();
    }

    complete() {
        this.end_time = Date.now();
    }

    print_results() {
        if (!this.end_time) {
            this.complete()
        }
        let elapsed = this.end_time! - this.start_time
        console.log(`Elapsed: ${elapsed}ms`)
        this.winning_boards = [] // FOR EASIER DEBUG
        console.log(this)
        const percentage_states_pruned = this.pruned_states / this.total_possible_states
        console.log(`percentage_states_pruned: ${percentage_states_pruned.toFixed(10)}%`)
        // for (let board of this.winning_boards) {
        //     console.log(board)
        // }
    }

    print_progress() {
        let portion_complete = ((this.visited_states + this.pruned_states) / this.total_possible_states)
        let elapsed_ms = Date.now() - this.start_time
        let total_ms = elapsed_ms / portion_complete
        let total_min = total_ms / (1000 * 60)
        console.log(
            `visited: ${this.visited_states}, \
pruned: ${this.pruned_states}, \
progress: ${portion_complete.toFixed(10)}% \
elapsed: ${elapsed_ms}ms
total: ${total_min} min
        `)
    }
}

function factorial(n: number) {
    // Factorial of 0 and 1 is 1
    if (n === 0 || n === 1) {
        return 1;
    }

    let result = 1;
    // Loop from 2 up to and including n
    for (let i = 2; i <= n; i++) {
        result *= i; // Equivalent to result = result * i;
    }

    return result;
}

function game_is_still_winnable(game_board: (string | null)[][], match_checker: MatchChecker): boolean {
    for (let i = 0; i < 5; i++) {
        const num_row_matches = match_checker.memoized_number_of_matches(get_row(i, game_board))
        if (num_row_matches > 0) {
            return true
        }
        const num_col_matches = match_checker.memoized_number_of_matches(get_col(i, game_board))
        if (num_col_matches > 0) {
            return true
        }
    }
    return false
}

function recursive_foo(game_board: (string | null)[][], full_sequence: string, sequence_index: number, search_depth: number, dictionary: Set<string>, match_checker: MatchChecker, stats: Stats) {
    if (sequence_index >= search_depth) {
        return
    }
    const current_letter = full_sequence[sequence_index]
    // console.log(`recursive_foo for sequence ${full_sequence}, current_letter: ${current_letter}`)

    for (let row = 0; row < 5; row += 1) {
        for (let col = 0; col < 5; col += 1) {

            if (game_board[row][col] !== null) {
                // Cell is already taken
                continue
            }

            // Set the cell to the current letter
            game_board[row][col] = current_letter
            stats.visited_states++

            // console.log(game_board)

            // Check if it's solved
            let row_wins = false
            let col_wins = false
            const row_letters = get_row(row, game_board)
            if (!row_letters.some((l) => l === null)) {
                // Row is filled
                // Check if it's in the dictionary
                if (dictionary.has(row_letters.join(""))) {
                    row_wins = true
                }
            }
            const col_letters = get_col(col, game_board)
            if (!col_letters.some((l) => l === null)) {
                // Col is filled
                // Check if it's in the dictionary
                if (dictionary.has(col_letters.join(""))) {
                    col_wins = true
                }
            }
            if (row_wins || col_wins) {
                stats.winning_states++
                stats.pruned_branches++
                const num_empty_cells = 25 - sequence_index - 1
                stats.pruned_states += factorial(num_empty_cells)
                stats.winning_boards.push(clone_board(game_board))
            } else {
                const is_winnable = game_is_still_winnable(game_board, match_checker)

                if (is_winnable) {
                    // The game is still winnable
                    recursive_foo(game_board, full_sequence, sequence_index + 1, search_depth, dictionary, match_checker, stats)
                } else {
                    stats.pruned_branches++
                    const num_empty_cells = 25 - sequence_index - 1
                    stats.pruned_states += factorial(num_empty_cells)
                }
            }

            // Unset the cell back to null, backtracking prevents high memory usage
            game_board[row][col] = null


            // Finally, print results if at the first or second layer
            if (sequence_index <= 0) {
                console.log(`${current_letter} => (${row}, ${col})`)
                stats.print_progress()
            }
        }

    }
}

let sequence_filepath = process.argv[2];

const dictionary_filepath = "src/lib/content/wordle_all.txt"

main(sequence_filepath, dictionary_filepath)
