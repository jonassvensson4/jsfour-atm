resource_manifest_version '44febabe-d386-4d18-afbe-5e627f4af937'

ui_page 'html/index.html'

server_script {
	'@mysql-async/lib/MySQL.lua',
	'server.lua'
}

client_script {
	'config.lua',
	'client.lua'
}

files {
	'html/assets/images/fleeca.png',
	'html/assets/images/blaine.png',
	'html/assets/images/pacific.png',
	'html/assets/images/background.png',
	'html/assets/images/button.png',
	'html/assets/images/button_active.png',
	'html/assets/images/button_cancel.png',
	'html/assets/images/button_cancel_active.png',
	'html/assets/images/button_done.png',
	'html/assets/images/button_done_active.png',
	'html/assets/images/button_wrong.png',
	'html/assets/images/button_wrong_active.png',
	'html/assets/images/card.png',
	'html/assets/images/cardflash.gif',
	'html/assets/images/code_background.png',
	'html/assets/images/error.png',
	'html/assets/images/loading.png',
	'html/assets/images/logo.png',
	'html/assets/images/money.gif',
	'html/assets/images/receipt.gif',
	'html/assets/images/welcome.png',
	'html/assets/images/welcome_code.png',
	'html/assets/sounds/click.ogg',
	'html/assets/sounds/insert.ogg',
	'html/assets/sounds/money.ogg',
	'html/assets/sounds/error.ogg',
	'html/assets/fonts/roboto/Roboto-Bold.woff',
	'html/assets/fonts/roboto/Roboto-Bold.woff2',
	'html/assets/fonts/roboto/Roboto-Light.woff',
	'html/assets/fonts/roboto/Roboto-Light.woff2',
	'html/assets/fonts/roboto/Roboto-Medium.woff',
	'html/assets/fonts/roboto/Roboto-Medium.woff2',
	'html/assets/fonts/roboto/Roboto-Regular.woff',
	'html/assets/fonts/roboto/Roboto-Regular.woff2',
	'html/assets/fonts/roboto/Roboto-Thin.woff',
	'html/assets/fonts/roboto/Roboto-Thin.woff2',
	'html/assets/css/materialize.min.css',
	'html/assets/css/style.css',
	'html/assets/css/bank.css',
	'html/assets/js/jquery.js',
	'html/assets/js/materialize.js',
	'html/assets/js/init.js',
	'html/assets/js/bank.js',
	'html/index.html',
	'html/bank.html',
}
