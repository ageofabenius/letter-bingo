<script lang="ts">
	let {
		letter,
		bordered
	}: {
		letter: string | null;
		bordered?: boolean;
	} = $props();
</script>

<span
	class="
    flex
    aspect-square
    size-full
    items-center justify-center
    {bordered ? 'border' : ''}
    "
>
	{letter}
</span>
