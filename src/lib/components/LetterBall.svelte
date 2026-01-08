<script lang="ts">
	import { onMount } from 'svelte';

	let {
		pop_letter = $bindable()
	}: {
		pop_letter: () => string;
	} = $props();

	pop_letter = pop_letter_impl;

	export function pop_letter_impl(): string {
		const popped_letter = current_letter;
        advance_letter()
		return popped_letter;
	}

	let test_letters = ['a', 'b', 'c', 'd', 'e'];

	function advance_letter() {
		current_letter = test_letters.shift()!;
	}

	let current_letter: string = $state('');

	onMount(() => {
		advance_letter();
	});
</script>

<div class="flex aspect-square size-16 items-center justify-center border">
	{current_letter}
</div>
