export type AtemEvents = {
	[key: `me.${number}.test`]: {
		abc: string
	}
	[key: `me.${number}.another`]: {
		def: string
	}
}
