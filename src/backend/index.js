const { ipcMain } = require('electron')

const converteJpgToPng = require('./converteJpgToPng')

//1 canal de comunicação
ipcMain.on('converteImages', (event, images) => {
	images.forEach(image => {
		converteJpgToPng(image).then(resp => {
			event.reply('converteImages', resp)
		})
	})
})