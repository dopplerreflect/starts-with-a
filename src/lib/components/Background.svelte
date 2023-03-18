<script lang="ts">
	export let width: number;
	export let height: number = width;
	export let fill: string;
</script>

<path d={`M${-width / 2} ${-height / 2}H${width / 2}V${height / 2}H${-width / 2}Z`} {fill} />
