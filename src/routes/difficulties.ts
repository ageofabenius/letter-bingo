import { HALFISH_SCRABBLE_LETTER_DISTRIBUTION, SCRABBLE_LETTER_DISTRIBUTION, type RemainingLetterCount } from '$lib/components/letter_bag.svelte';


export type Difficulty = {
    num_letters_drawn: number,
    number_letters_total: number,
    letter_sampling_distribution: RemainingLetterCount
}

export const EASY = {
    num_letters_drawn: 3,
    number_letters_total: 40,
    letter_sampling_distribution: HALFISH_SCRABBLE_LETTER_DISTRIBUTION
}

export const MEDIUM = {
    num_letters_drawn: 2,
    number_letters_total: 50,
    letter_sampling_distribution: HALFISH_SCRABBLE_LETTER_DISTRIBUTION
}

export const HARD = {
    num_letters_drawn: 2,
    number_letters_total: 98,
    letter_sampling_distribution: SCRABBLE_LETTER_DISTRIBUTION
}