import { arrayMap, phi, radialPointString } from './geometry.ts';

const size = 100;
const r = size / 2;
const radii = arrayMap(5, (n) => Math.round(r * phi ** n));
const angles = arrayMap(4, (n) => 90 * n - 90);

export function parsedPath(input: string): void {
	console.log(input);
	const s = input
		.replace(/([A-Z])(\d+)/g, '$1 $2')
		.replace(/(\d+)([A-Z])/g, '$1 $2')
		.split(' ');
	console.log(s);
	let index = 0;

	function points(count = 1): string {
		return [...Array(count)]
			.map(() => {
				return radialPointString(angles[Number(s[index++])], radii[Number(s[index++])]);
			})
			.join(' ');
	}

	function angleParse(): string {
		return `${radii[Number(s[index++])]} ${radii[Number(s[index++])]} ${Number(
			s[index++]
		)} ${Number(s[index++])} ${Number(s[index++])} ${radialPointString(
			angles[Number(s[index++])],
			radii[Number(s[index++])]
		)}`;
	}

	let pathCommand = '';
	function appendCommand(cmd: string, values: string): void {
		pathCommand += `${cmd}${values}`;
	}

	function parse() {
		switch (s[index]) {
			case 'A':
				appendCommand(s[index++], angleParse());
				break;
			case 'M':
			case 'L':
				appendCommand(s[index++], points());
				break;
			case 'Q':
			case 'S':
				appendCommand(s[index++], points(2));
				break;
			case 'C':
				appendCommand(s[index++], points(3));
				break;
			case 'Z':
				appendCommand(s[index++], '');
				break;
		}
	}
	while (index < s.length) {
		parse();
	}
	console.log(pathCommand);
}

// const testString = 'M35 15Q35 16 41 17L35 18L92 17Q35 16 35 15Z';
// const testString = 'M41 11C41 12 35 12 35 13A13 13 0 0 1 47 13C46 12 41 12 41 11Z';
const testString = 'M0 0L0 1A1 1 0 0 0 3 1L3 0A0 0 0 0 1 0 0Z';

parsedPath(testString);
