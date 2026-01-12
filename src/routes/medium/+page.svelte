<script lang="ts">
	import GameComp from '$lib/components/Game.svelte';
	import WordleWordList from '$lib/content/wordle_all.txt?raw';
	import { Game } from '$lib/components/game.svelte';
	import { MEDIUM } from '../difficulties';

	let game = new Game(
		WordleWordList.split('\n'),
		MEDIUM.num_letters_drawn,
		MEDIUM.number_letters_total,
		MEDIUM.letter_sampling_distribution
	);
</script>

<GameComp {game} />
