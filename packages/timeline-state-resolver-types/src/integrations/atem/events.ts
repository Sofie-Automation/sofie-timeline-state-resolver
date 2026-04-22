type AtemEvents = {
	[key: `me.${number}.inputs`]: {
		programInput: number
		previewInput: number
	}
	[key: `me.${number}.another`]: {
		test: false
	}
}

export default AtemEvents
