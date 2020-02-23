// *******
// Copyright (C) JSFOUR - All Rights Reserved
// You are not allowed to sell this script or re-upload it
// Visit my page at https://github.com/jonassvensson4
// Written by Jonas Svensson, July 2018
// *******

let bankType = 'fleeca'
let location = null;
let callbacks = {};

// Server callback
function serverCallback( name, data, cb ) {
    let id = Object.keys( callbacks ).length++;
    callbacks[id] = cb;
    data['CallbackID'] = id;
    emitNet(name, data);
}

// Register client event
RegisterNetEvent('jsfour-atm:callback');
onNet('jsfour-atm:callback', ( data, id ) => {
	callbacks[id](data);
    delete callbacks[id];
});

// Notification
function hintToDisplay( text ) {
	SetTextComponentFormat("STRING")
	AddTextComponentString(text)
	DisplayHelpTextFromStringLabel(0, 0, 1, -1)
}

// Check distance between the player and the locations
function checkDistance() {
	let pedCoords = GetEntityCoords(GetPlayerPed(-1));
	location = false;

	Object.keys( locations ).forEach(key => {
		let distance = GetDistanceBetweenCoords(pedCoords[0], pedCoords[1], pedCoords[2], locations[key].x, locations[key].y, locations[key].z, true);

		if ( distance < 2 ) {
			location = key;
		}
	});
    
    return location;
}

// Remove NUI focus on start (incase of a resource restart)
setImmediate(() => {
    SetNuiFocus(false, false);
})

// Show blips if set to true in the config
if ( blips.show ) {
	Object.keys( locations ).forEach(key => {
		let blip = AddBlipForCoord(locations[key].x, locations[key].y, locations[key].z);
		SetBlipSprite(blip, blips.sprite);
		SetBlipDisplay(blip, 4);
		SetBlipScale(blip, 0.9);
		SetBlipColour(blip, 2);
		SetBlipAsShortRange(blip, true);
		BeginTextCommandSetBlipName("STRING");
		AddTextComponentString(blips.text);
		EndTextCommandSetBlipName(blip);
	});
}

// Key press event
setTick(() => {
	if ( IsControlJustReleased(0, key) ) {
		// Check distance
		if ( checkDistance() ) {
			let type = 'openATM';

			SetNuiFocus(true, true);

			// Checks if the player is trying to access a bank
			if ( locations[location].type ) {
				type = 'openBank';
			}

			// "Pre-open" the NUI to prevent it from takine 0.2s, the bank however will take some time to open
			SendNuiMessage(JSON.stringify({
				action: type
			}));

			// Run a server callback function to get data from the database
			serverCallback('jsfour-atm:getUserData', {}, ( data ) => {
				// Send the stuff to the NUI
				SendNuiMessage(JSON.stringify({
					action: type,
					type: bankType,
					user: data
				}));
			});
		}
	}
});

// Create account when the script is started
setTimeout(() => {
	emitNet('jsfour-atm:create');
}, 500);

// Register NUI callbacks
RegisterNuiCallbackType('jsfour-atm:deposit');
RegisterNuiCallbackType('jsfour-atm:withdraw');
RegisterNuiCallbackType('jsfour-atm:transfer');
RegisterNuiCallbackType('jsfour-atm:changePincode');
RegisterNuiCallbackType('jsfour-atm:error');
RegisterNuiCallbackType('jsfour-atm:close');

// Deposit money
on('__cfx_nui:jsfour-atm:deposit', ( data, cb ) => {
	emitNet('jsfour-atm:deposit', data);
	cb(true)
});

// Withdraw money
on('__cfx_nui:jsfour-atm:withdraw', ( data, cb ) => {
	emitNet('jsfour-atm:withdraw', data);
	cb(true)
});

// Transfer money
on('__cfx_nui:jsfour-atm:transfer', ( data, cb ) => {
	emitNet('jsfour-atm:transfer', data);
	cb(true)
});

// Change the pincode
on('__cfx_nui:jsfour-atm:changePincode', ( data, cb ) => {
	emitNet('jsfour-atm:changePincode', data);
	hintToDisplay(pincodeChanged);
	cb(true);
});


// Close the ATM
on('__cfx_nui:jsfour-atm:close', ( data ) => {
	SetNuiFocus(false, false);
});

// Error message
on('__cfx_nui:jsfour-atm:error', ( data, cb ) => {
	SetNuiFocus(false, false);
	hintToDisplay(machineError);
	cb(true)
});