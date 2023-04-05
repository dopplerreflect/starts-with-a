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
				let o = `angle ${s[index++]} radius ${s[index++]}`;
				return o;
			})
			.join(' ');
	}

	function angleParse(): string {
		let o = `xRadius ${s[index++]} yRadius ${s[index++]} arc ${s[index++]} ${s[index++]} ${
			s[index++]
		} ${points()}`;
		return o;
	}
	function parse() {
		switch (s[index]) {
			case 'A':
				console.log(s[index++], angleParse());
				break;
			case 'M':
			case 'L':
				console.log(s[index++], points());
				break;
			case 'Q':
			case 'S':
				console.log(s[index++], points(2));
				break;
			case 'C':
				console.log(s[index++], points(3));
				break;
			case 'Z':
				console.log(s[index++]);
				index += 1;
				break;
		}
	}
	while (index < s.length) {
		parse();
	}
}

// const testString = 'M35 15Q35 16 41 17L35 18L92 17Q35 16 35 15Z';
const testString = 'M41 11C41 12 35 12 35 13A13 13 0 0 1 47 13C46 12 41 12 41 11Z';

parsedPath(testString);
