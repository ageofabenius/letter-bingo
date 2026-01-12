<script lang="ts">
	import GameComp from '$lib/components/Game.svelte';
	import WordleWordList from '$lib/content/wordle_all.txt?raw';
	import { Game } from '$lib/components/game.svelte';
	import { HARD } from '../difficulties';

	let game = new Game(
		WordleWordList.split('\n'),
		HARD.num_letters_drawn,
		HARD.number_letters_total,
		HARD.letter_sampling_distribution
	);
</script>

<GameComp {game} />
