<script lang="ts">
	export let id = 'SaturationFilter';
	export let values: string = '0.5';
</script>

<filter {id}>
	<feColorMatrix type="saturate" {values} />
</filter>
