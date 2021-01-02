const { exec } = require('child_process')

module.exports = image => {
	return new Promise((resolve, reject) => {
		try {
			let newImage = image.replace('.jpg', '.png')

			exec(`convert -quality 100 -density 300 ${image} ${newImage}`, (error, stdout, stderr) => {
				if (!error && !stderr) {
					resolve(`Convertida: ${newImage}`)
				} else {
					resolve(`Erro: ${newImage}`)
				}
			})
		} catch (error) {
			reject(error)
		}
	})
}