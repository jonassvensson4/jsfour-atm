fx_version 'adamant'

game 'gta5'

ui_page 'client/html/index.html'

client_script {
	'client/config.js',
	'client/client.js'
}

server_script {
	'@mysql-async/lib/MySQL.lua',
	'server/server.js'
}

dependency 'mysql-async'

files {
	'client/html/assets/images/*.png',
	'client/html/assets/images/*.gif',
	'client/html/assets/sounds/*.ogg',
	'client/html/assets/fonts/roboto/*.woff',
	'client/html/assets/fonts/roboto/*.woff2',
	'client/html/assets/css/*.css',
	'client/html/assets/js/*.js',
	'client/html/*.html',
}
