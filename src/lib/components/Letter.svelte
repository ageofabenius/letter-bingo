<script lang="ts">
	let {
		letter,
		bordered
	}: {
		letter: string | null;
		bordered?: boolean;
	} = $props();
</script>

<div
	class="
    flex
    aspect-square
	items-center
    justify-center
    {bordered ? 'border' : ''}
    size-12
	sm:size-20
	lg:size-24
	text-md
	sm:text-2xl
	lg:text-3xl
    "
>
	{letter}
</div>
