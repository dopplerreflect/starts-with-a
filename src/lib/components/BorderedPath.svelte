<script lang="ts">
	export let d: string = '';
	export let outerColor: string = 'white';
	export let innerColor: string = 'black';
	export let strokeWidth: number = 1;
</script>

<path {d} stroke={outerColor} stroke-width={strokeWidth} fill="none" />
<path {d} stroke={innerColor} stroke-width={strokeWidth / 3} fill="none" />
