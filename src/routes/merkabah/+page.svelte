<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		SQRT3,
		anglesArray,
		arrayMap,
		polygonPath,
		pythag,
		radialPoint,
		radialPointString,
		tan
	} from '$lib/geometry';
	const size = 2 ** 10;
	const r = 100;
	const vesica = r * SQRT3;
	const angles = anglesArray(6);
	const circles: Circle[] = [
		{ r, x: 0, y: 0 },
		...angles.map((a) => ({ r, ...radialPoint(a, r) })),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 2) })),
		...angles.map((a) => ({ r, ...radialPoint(a - 30, r * SQRT3) })),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 3) })),
		...angles.map((a) => ({
			r,
			...radialPoint(a + tan(vesica, r * 2), pythag(vesica / 2, r * 2.5))
		})),
		...angles.map((a) => ({
			r,
			...radialPoint(a - tan(vesica, r * 2), pythag(vesica / 2, r * 2.5))
		})),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 4) })),
		...angles.map((a) => ({ r, ...radialPoint(a - 30, r * SQRT3 * 2) })),
		...angles.map((a) => ({
			r,
			...radialPoint(a + tan(vesica / 2, r * 3.5), pythag(vesica / 2, r * 3.5))
		})),
		...angles.map((a) => ({
			r,
			...radialPoint(a - tan(vesica / 2, r * 3.5), pythag(vesica / 2, r * 3.5))
		}))
	];
	const dr = arrayMap(6, (i) => i + 1);
</script>

<DopplerSvg {size} id="merkabah" zoom={0} xPan={0} yPan={0}>
	<defs>
		<style>
			#circles,
			#figure {
				filter: url(#glow);
				fill: none;
				stroke: white;
			}
			path.filled {
				fill: white;
			}
			#figure path {
				stroke: none;
				fill: white;
			}
		</style>

		<filter id="glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="8" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="black" />

	<g id="circles">
		{#each circles as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				stroke={`oklch(0.5 0.37 ${200 + Math.sqrt(c.x ** 2 + c.y ** 2) * ((r * 4) / 1800)})`}
			/>
		{/each}
	</g>
	<!-- 
	<path d={polygonPath(3, r * 4)} stroke-width={5} />
	<path d={polygonPath(3, r * 4, { rotate: 180 })} stroke-width={1} />
	<path d={polygonPath(3, r * 2)} stroke-width={1.5} />
	<path d={polygonPath(3, r * 2, { rotate: 180 })} stroke-width={2.5} />
	<path d={polygonPath(6, r * 2, { rotate: 180 })} />
	{#each [1, 3, 5] as i}
		<path
			class="filled"
			d={`M${radialPointString(angles[i] - 60, 2)} 0 0 ${radialPointString(
				angles[i] + 60,
				2
			)} ${radialPointString(angles[i], r * 4)}Z`}
		/>
	{/each}
	{#each [0, 2, 4] as i}
		<path
			class="filled"
			d={`M0 0 ${radialPointString(angles[i] + 0.33, r * 4)} ${radialPointString(
				angles[i] - 0.33,
				r * 4
			)}Z`}
		/>
	{/each} 
-->
	<g id="figure">
		<path
			d={`M${radialPointString(angles[4], r * 4)} ${radialPointString(angles[0] + 30, dr[4], {
				center: radialPoint(angles[4], r * 4)
			})} ${radialPointString(angles[5], dr[0], {
				center: { x: 0, y: 0 }
			})} 0 0 ${radialPointString(angles[3], dr[0], {
				center: { x: 0, y: 0 }
			})} ${radialPointString(angles[2] - 30, dr[4], { center: radialPoint(angles[4], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[0], r * 4)} ${radialPointString(angles[4] - 30, dr[2], {
				center: radialPoint(angles[0], r * 4)
			})} ${radialPointString(angles[5], dr[0], {
				center: { x: 0, y: 0 }
			})} 0 0 ${radialPointString(angles[1], dr[0], {
				center: { x: 0, y: 0 }
			})} ${radialPointString(angles[2] + 30, dr[2], { center: radialPoint(angles[0], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[2], r * 4)} ${radialPointString(angles[0] - 30, dr[4], {
				center: radialPoint(angles[2], r * 4)
			})} ${radialPointString(angles[1], dr[0], {
				center: { x: 0, y: 0 }
			})} 0 0 ${radialPointString(angles[3], dr[0], {
				center: { x: 0, y: 0 }
			})} ${radialPointString(angles[4] + 30, dr[4], { center: radialPoint(angles[2], r * 4) })}Z`}
		/>
		<path
			d={`M${radialPointString(angles[4], dr[4], {
				center: radialPoint(angles[4], r * 4)
			})} ${radialPointString(angles[2], dr[4], {
				center: radialPoint(angles[2], r * 4)
			})} ${radialPointString(angles[5], dr[4], {
				center: radialPoint(angles[2], r * 4)
			})} ${radialPointString(angles[1], dr[4], { center: radialPoint(angles[4], r * 4) })}Z`}
		/>
		<path
			d={`M${radialPointString(angles[4], dr[4], {
				center: radialPoint(angles[4], r * 4)
			})} ${radialPointString(angles[0], dr[2], {
				center: radialPoint(angles[0], r * 4)
			})} ${radialPointString(angles[3], dr[2], {
				center: radialPoint(angles[0], r * 4)
			})} ${radialPointString(angles[1], dr[4], { center: radialPoint(angles[4], r * 4) })}Z`}
		/>
		<path
			d={`M${radialPointString(angles[0], dr[2], {
				center: radialPoint(angles[0], r * 4)
			})} ${radialPointString(angles[2], dr[4], {
				center: radialPoint(angles[2], r * 4)
			})} ${radialPointString(angles[5], dr[4], {
				center: radialPoint(angles[2], r * 4)
			})} ${radialPointString(angles[3], dr[4], { center: radialPoint(angles[0], r * 4) })}`}
		/>

		<path
			d={`M${radialPointString(angles[5], r * 4)} ${radialPointString(angles[1] + 30, dr[1], {
				center: radialPoint(angles[5], r * 4)
			})} ${radialPointString(angles[0], dr[5], {
				center: { x: 0, y: 0 }
			})} 0 0 ${radialPointString(angles[4], dr[5], {
				center: { x: 0, y: 0 }
			})} ${radialPointString(angles[3] - 30, dr[1], { center: radialPoint(angles[5], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[1], r * 4)} ${radialPointString(angles[3] + 30, dr[1], {
				center: radialPoint(angles[1], r * 4)
			})} ${radialPointString(angles[2], dr[5], {
				center: { x: 0, y: 0 }
			})} 0 0 ${radialPointString(angles[0], dr[5], {
				center: { x: 0, y: 0 }
			})} ${radialPointString(angles[4] + 30, dr[1], { center: radialPoint(angles[1], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[3], r * 4)} ${radialPointString(angles[5] + 30, dr[3], {
				center: radialPoint(angles[3], r * 4)
			})} ${radialPointString(angles[4], dr[5], {
				center: { x: 0, y: 0 }
			})} 0 0 ${radialPointString(angles[2], dr[5], {
				center: { x: 0, y: 0 }
			})} ${radialPointString(angles[1] - 30, dr[3], { center: radialPoint(angles[3], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[5], dr[1], {
				center: radialPoint(angles[5], r * 4)
			})} ${radialPointString(angles[1], dr[1], {
				center: radialPoint(angles[1], r * 4)
			})} ${radialPointString(angles[4], dr[1], {
				center: radialPoint(angles[1], r * 4)
			})} ${radialPointString(angles[2], dr[1], { center: radialPoint(angles[5], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[1], dr[1], {
				center: radialPoint(angles[1], r * 4)
			})} ${radialPointString(angles[3], dr[3], {
				center: radialPoint(angles[3], r * 4)
			})} ${radialPointString(angles[0], dr[3], {
				center: radialPoint(angles[3], r * 4)
			})} ${radialPointString(angles[4], dr[1], { center: radialPoint(angles[1], r * 4) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[5], dr[1], {
				center: radialPoint(angles[5], r * 4)
			})} ${radialPointString(angles[3], dr[3], {
				center: radialPoint(angles[3], r * 4)
			})} ${radialPointString(angles[0], dr[3], {
				center: radialPoint(angles[3], r * 4)
			})} ${radialPointString(angles[2], dr[1], { center: radialPoint(angles[5], r * 4) })}Z`}
		/>
	</g>
</DopplerSvg>
