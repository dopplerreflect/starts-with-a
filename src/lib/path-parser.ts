import { radialPointString } from './geometry';

export function pathFromDSL(angles: number[], radii: number[]) {
	return function (input: string): string {
		let index = 0,
			output = '';

		const s = input
			.replace(/([A-Z])(\d+)/g, '$1 $2')
			.replace(/(\d+)([A-Z])/g, '$1 $2')
			.split(' ');

		function points(count = 1): string {
			return [...Array(count)]
				.map(() => radialPointString(angles[Number(s[index++])], radii[Number(s[index++])]))
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

		function appendCommand(cmd: string, values: string): void {
			output += `${cmd}${values}`;
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
		return output;
	};
}
