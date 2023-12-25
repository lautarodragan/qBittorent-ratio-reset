import { Buffer } from 'node:buffer'
import { readFileSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs'
import * as path from 'node:path'

const fastresumeFolderPath = process.env.HOME + '/.local/share/qBittorrent/BT_backup'
const dir = readdirSync(fastresumeFolderPath)

const fileNames = dir.filter(x => x.endsWith('.fastresume'))

const Keys = {
	TotalDownloaded: 'total_downloaded',
	Name: 'name',
}

function getEntryByName(buffer, keyName) {
	const startIndex = buffer.indexOf(`:${keyName}`, 'utf8') + 1
	const endIndex = buffer.indexOf(':', startIndex)
		
	return {
		startIndex, // subarray().byteOffset does not equal startIndex... ytho?
		endIndex,
		byteArray: buffer.subarray(startIndex, endIndex),
	}
}

function getEntryAtByteIndex(buffer, byteIndex) {
	const startIndex = buffer.subarray(0, byteIndex).lastIndexOf(':', 'utf8') + 1
	const endIndex = buffer.indexOf(':', startIndex)
	return buffer.subarray(startIndex, endIndex)
}

function updateFile(fileName) {
	const filePath = path.join(fastresumeFolderPath, fileName)
	const fileData = readFileSync(filePath)
	const totalDownloadedArray = getEntryByName(fileData, Keys.TotalDownloaded)
	const nameArray = getEntryByName(fileData, Keys.Name)
	const nameValueArray = getEntryAtByteIndex(fileData, nameArray.endIndex + 1)
	
	console.log(fileName)
	console.log(nameValueArray.toString())
	console.log(totalDownloadedArray.byteArray.toString())
	console.log()
	
	const firstChunk = fileData.subarray(0, totalDownloadedArray.startIndex)
	const secondChunk = fileData.subarray(totalDownloadedArray.endIndex)
	
	const newFileData = Buffer.concat([firstChunk, Buffer.from('total_downloadedi0e14'), secondChunk])
	
	copyFileSync(filePath, path.join(fastresumeFolderPath, `${fileName}.backup.${new Date().getTime()}`))
	writeFileSync(filePath, newFileData)
}

for (const fileName of fileNames) {
	updateFile(fileName)
}