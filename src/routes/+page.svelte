<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import LetterBall from '$lib/components/LetterBall.svelte';

	let pop_letter: () => string;
</script>

<div class="flex flex-col gap-10 px-[20%] py-10">
	<LetterBall bind:pop_letter />
	<Grid {pop_letter} />
</div>
