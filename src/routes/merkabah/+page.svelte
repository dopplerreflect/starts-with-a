<svelte:options namespace="svg" />

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import {
		Phi,
		SQRT3,
		anglesArray,
		arrayMap,
		pathFromPoints,
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
			:root {
				--merkabah-color: oklch(1 0.37 100 / 0.5);
			}
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
				/* display: none; */
				stroke: none;
				fill: var(--merkabah-color);
			}
			#figure line {
				stroke: var(--merkabah-color);
			}
			#guide path {
				display: none;
				fill: none;
				stroke: white;
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
		<HexPattern
			id="HexPattern"
			size={r / 6}
			patternTransform="rotate(30)"
			stroke="oklch(0.35 0.37 300)"
		/>
		<HexPattern
			id="HexPattern2"
			size={r / 3}
			patternTransform="rotate(30)"
			stroke="oklch(0.5 0.09 240)"
		/>
	</defs>
	<Background {size} fill="black" />
	<Background {size} fill="url(#HexPattern)" />
	<Background {size} fill="url(#HexPattern2)" />
	<g id="circles">
		{#each circles as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				stroke-width={3}
				stroke={`oklch(0.5 0.09 ${200 + Math.sqrt(c.x ** 2 + c.y ** 2) * ((r * 4) / (360 * 5))})`}
			/>
		{/each}
	</g>

	<g id="guide">
		<path d={polygonPath(3, r * 4)} stroke-width={5} />
		<path d={polygonPath(3, r * 4, { rotate: 180 })} />
		<path d={polygonPath(3, r * 2)} stroke-width={1.5} />
		<path d={polygonPath(3, r * 2, { rotate: 180 })} />
		<path d={polygonPath(6, r * 2, { rotate: 180 })} />
	</g>

	<g id="figure">
		<line
			x1={radialPoint(angles[5], r * 2).x}
			y1={radialPoint(angles[5], r * 2).y}
			x2={radialPoint(angles[1], r * 2).x}
			y2={radialPoint(angles[1], r * 2).y}
			stroke-width={dr[4]}
		/>

		<line
			x1={radialPoint(angles[3], r * 2).x}
			y1={radialPoint(angles[3], r * 2).y}
			x2={radialPoint(angles[1], r * 2).x}
			y2={radialPoint(angles[1], r * 2).y}
			stroke-width={dr[4]}
		/>
		<line
			x1={radialPoint(angles[5], r * 2).x}
			y1={radialPoint(angles[5], r * 2).y}
			x2={radialPoint(angles[3], r * 2).x}
			y2={radialPoint(angles[3], r * 2).y}
			stroke-width={dr[4]}
		/>

		<path
			d={`M${radialPointString(angles[0], dr[4], {
				center: radialPoint(angles[5], r * 2)
			})} ${radialPointString(angles[4], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})} ${radialPointString(angles[3], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})} ${radialPointString(angles[1], dr[4], { center: radialPoint(angles[5], r * 2) })} Z`}
		/>

		<path
			d={`M${radialPointString(angles[0], dr[4], {
				center: radialPoint(angles[1], r * 2)
			})} ${radialPointString(angles[2], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})} ${radialPointString(angles[3], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})} ${radialPointString(angles[5], dr[4], { center: radialPoint(angles[1], r * 2) })} Z`}
		/>

		<line
			x1={radialPoint(angles[4], r * 2).x}
			y1={radialPoint(angles[4], r * 2).y}
			x2={radialPoint(angles[2], r * 2).x}
			y2={radialPoint(angles[2], r * 2).y}
			stroke-width={dr[2]}
		/>

		<path
			d={`M${radialPointString(angles[4], dr[4], {
				center: radialPoint(angles[3], r * 2)
			})} ${radialPointString(angles[3], dr[2], {
				center: radialPoint(angles[4], r * 2)
			})} ${radialPointString(angles[2], dr[2], {
				center: radialPoint(angles[4], r * 2)
			})} ${radialPointString(angles[0], dr[4], {
				center: radialPoint(angles[3], r * 2)
			})}Z`}
		/>

		<path
			d={`M${radialPointString(angles[4], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})} ${radialPointString(angles[5], dr[2], {
				center: radialPoint(angles[4], r * 2)
			})} ${radialPointString(angles[3], dr[2], {
				center: radialPoint(angles[4], r * 2)
			})} ${radialPointString(angles[2], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})}Z`}
		/>

		<path
			d={`M${radialPointString(angles[2], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})} ${radialPointString(angles[0], dr[2], {
				center: radialPoint(angles[2], r * 2)
			})} ${radialPointString(angles[4], dr[2], {
				center: radialPoint(angles[2], r * 2)
			})} ${radialPointString(angles[4], dr[1], {
				center: radialPoint(angles[0], r * 2)
			})}Z`}
		/>

		<path
			d={`M${radialPointString(angles[2], dr[4], {
				center: radialPoint(angles[3], r * 2)
			})} ${radialPointString(angles[3], dr[2], {
				center: radialPoint(angles[2], r * 2)
			})} ${radialPointString(angles[4], dr[2], {
				center: radialPoint(angles[2], r * 2)
			})} ${radialPointString(angles[0], dr[4], {
				center: radialPoint(angles[3], r * 2)
			})}Z`}
		/>

		<path
			d={`M${radialPointString(angles[4], dr[4], {
				center: radialPoint(angles[5], r * 2)
			})} ${radialPointString(angles[2], dr[4], {
				center: radialPoint(angles[5], r * 2)
			})} ${radialPointString(angles[1], dr[1], {
				center: radialPoint(angles[4], r * 2)
			})} ${radialPointString(angles[5], dr[1], { center: radialPoint(angles[4], r * 2) })}Z`}
		/>

		<path
			d={`M${radialPointString(angles[4], dr[4], {
				center: radialPoint(angles[1], r * 2)
			})} ${radialPointString(angles[2], dr[4], {
				center: radialPoint(angles[1], r * 2)
			})} ${radialPointString(angles[1], dr[1], {
				center: radialPoint(angles[2], r * 2)
			})} ${radialPointString(angles[5], dr[1], { center: radialPoint(angles[2], r * 2) })}Z`}
		/>

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
			})} ${radialPointString(angles[3], dr[2], { center: radialPoint(angles[0], r * 4) })}`}
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
			d={pathFromPoints([
				radialPoint(angles[5], dr[1], { center: radialPoint(angles[5], r * 4) }),
				radialPoint(angles[3], dr[3], { center: radialPoint(angles[3], r * 4) }),
				radialPoint(angles[0], dr[3], { center: radialPoint(angles[3], r * 4) }),
				radialPoint(angles[2], dr[1], { center: radialPoint(angles[5], r * 4) })
			])}
		/>
	</g>

	<path
		d={pathFromPoints([
			radialPoint(angles[0], r * 4),
			radialPoint(angles[2], r * 4),
			radialPoint(angles[4], r * 4),
			radialPoint(angles[5], r * 2),
			radialPoint(angles[1], r * 2),
			radialPoint(angles[3], r * 2),
			radialPoint(angles[5], r * 2)
		])}
		fill-rule="evenodd"
		fill="oklch(0.9 0.37 90 / 0.55)"
	/>

	<path
		d={pathFromPoints([
			radialPoint(angles[5], r * 4),
			{ x: 0, y: 0 },
			radialPoint(angles[1], r * 4),
			radialPoint(angles[1] - 30, r * 2.305),
			radialPoint(angles[1], r * 2),
			radialPoint(angles[5], r * 2),
			radialPoint(angles[5] + 30, r * 2.305)
		])}
		fill="oklch(1 0.37 90 / 0.55)"
	/>

	<path
		d={pathFromPoints([
			radialPoint(angles[1], r * 4),
			{ x: 0, y: 0 },
			radialPoint(angles[3], r * 4),
			radialPoint(angles[3] - 30, r * 2.305),
			radialPoint(angles[3], r * 2),
			radialPoint(angles[1], r * 2),
			radialPoint(angles[1] + 30, r * 2.305)
		])}
		fill="oklch(0.8 0.37 90 / 0.55)"
	/>

	<path
		d={pathFromPoints([
			radialPoint(angles[3], r * 4),
			{ x: 0, y: 0 },
			radialPoint(angles[5], r * 4),
			radialPoint(angles[5] - 30, r * 2.305),
			radialPoint(angles[5], r * 2),
			radialPoint(angles[3], r * 2),
			radialPoint(angles[3] + 30, r * 2.305)
		])}
		fill="oklch(0.7 0.37 90 / 0.55)"
	/>
</DopplerSvg>
