const fn = {
	"number?": (obj) => (+obj).toString() !== 'NaN',
	"+": (a, b) => {
		if (fn["number?"](a) && fn["number?"](b)) {
			return parseInt(a, 10) + parseInt(b, 10);
		} else {
			return a + b;
		}
	},
	"-": (a, b) => {
		if (fn["number?"](a) && fn["number?"](b)) {
			return parseInt(a, 10) - parseInt(b, 10);
		} else {
			return a / b;
		}
	},
	"/": (a, b) => {
		if (fn["number?"](a) && fn["number?"](b)) {
			return parseInt(a, 10) / parseInt(b, 10);
		} else {
			return a / b;
		}
	},
	"*": (a, b) => {
		if (fn["number?"](a) && fn["number?"](b)) {
			return parseInt(a, 10) * parseInt(b, 10);
		} else {
			return a * b;
		}
	},
}

function evall(_value: TemplateStringsArray) {
	const value = `(${_value[0]})`;

	const evals = value.split(/[(,)]/).filter(e => e != '');
	const slices = evals[0].split(' ');
	const [fun, ...args] = slices;

	const vars = args
		.filter(arg => arg[0] != "'" && arg[args.length] != "'" && !fn["number?"](arg));

	if (vars.length !== 0) {
		const [, ...argVars] = arguments.callee.caller.toString()
			.split(/[(,)]/)
			.map(arg => arg.trim());

		Object
			.entries(arguments.callee.caller.arguments)
			.forEach(([i, value]) => {
				const argName = argVars[i];
				const index = args.indexOf(argName);
				args[index] = value as string;
			})
	}


	return fn[fun].apply(fn[fun], args);
}

const arrayEquals = (a, b) => JSON.stringify(a) == JSON.stringify(b);

console.log(arrayEquals([
	evall`+ 1 1`,
	evall`- 4 2`,
	evall`/ 4 2`,
	evall`* 2 2`,
	evall`(+ 1 1)`,
	evall`number? 1`,
	evall`number? 'ble'`,
	evall`number? '1ble'`,
], [
	2,
	2,
	2,
	4,
	2,
	true,
	false,
	false,
]) ? 'OK' : 'found errors');

[
	evall`(+ 1 1)`
]
	.forEach(e => console.log(e))
