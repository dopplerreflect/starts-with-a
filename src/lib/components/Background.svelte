<script lang="ts">
	export let size: number = 0;
	export let width: number = size;
	export let height: number = width;
	export let fill: string;
	export let transform: string | null = null;
	export let filter: string | null = null;
</script>

<path
	d={`M${-width / 2} ${-height / 2}H${width / 2}V${height / 2}H${-width / 2}Z`}
	{fill}
	{transform}
	{filter}
/>
