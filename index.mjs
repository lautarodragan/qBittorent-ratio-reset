import { readFileSync, readdirSync } from 'node:fs'
import * as path from 'node:path'

const fastresumeFolderPath = process.env.HOME + '/.local/share/qBittorrent/BT_backup'
const dir = readdirSync(fastresumeFolderPath)

const fileNames = dir.filter(x => x.endsWith('.fastresume'))

for (const fileName of fileNames) {

	const file = readFileSync(path.join(fastresumeFolderPath, fileName))
	const parsedFile = file.toString().split(':')
	const nameIndex = parsedFile.findIndex(x => x.startsWith('name'))
	const name = parsedFile[nameIndex+1]
	// console.log(parsedFile)
	// console.log(nameIndex, parsedFile[nameIndex], parsedFile[nameIndex+1])
	const totalDownloadedField = parsedFile.find(x => x.includes('total')).split('i')
	const totalDownloaded = totalDownloadedField[1].split('e14')[0]

	console.log(name)
	console.log(fileName)
	console.log('totalDownloaded', totalDownloaded)
	console.log()
	console.log()
	// break

}