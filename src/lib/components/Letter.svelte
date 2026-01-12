<script lang="ts">
	let {
		letter,
		standalone
	}: {
		letter: string | null;
		standalone?: boolean;
	} = $props();
</script>

<div
	class="
    flex
    aspect-square
	items-center
    justify-center
    {standalone ? 'rounded-xs border-2 border-stone-200 shadow sm:rounded-sm md:rounded bg-stone-100' : ''}
    text-md
	size-12
	sm:size-20
	sm:text-2xl
	lg:size-24
	lg:text-3xl
    "
>
	{letter}
</div>
