// *******
// Copyright (C) JSFOUR - All Rights Reserved
// You are not allowed to sell this script or re-upload it
// Visit my page at https://github.com/jonassvensson4
// Written by Jonas Svensson, July 2018
// *******

let ESX = false;

// Checks if es_extended has been started to make it standalone..
if ( GetResourceState('es_extended') === 'started' ) {
    emit('esx:getSharedObject', ( obj ) =>  { ESX = obj; });
}

// Execute SQL query
async function executeQuery( sql, query, params ) {
    return new Promise( ( resolve, reject ) => {
        exports['mysql-async'][sql](query, params, ( result, err ) => {
            if ( err )
                return reject( err );
           
            return resolve( result );
        });
    });
}

// Register server events
RegisterNetEvent('jsfour-atm:getUserData');
RegisterNetEvent('jsfour-atm:deposit');
RegisterNetEvent('jsfour-atm:withdraw');
RegisterNetEvent('jsfour-atm:transfer');
RegisterNetEvent('jsfour-atm:create');
RegisterNetEvent('jsfour-atm:changePincode');

// Get user info
onNet('jsfour-atm:getUserData', async ( data ) => {
    let player = source;
    let identifier = GetPlayerIdentifier(player);
    let money = {};

    // If ESX is enabled
    if ( ESX ) {
        let xPlayer = ESX.GetPlayerFromId(player);
        money = {
            bank: xPlayer.getAccount('bank').money,
            cash: xPlayer.getMoney()
        }
    } else {
        // Otherwise.. Add your own stuff
        money = {
            bank: 9999,
            cash: 1000
        }
    }

    let user = await executeQuery(
        'mysql_fetch_all', 
        'SELECT `firstname`, `lastname` FROM `users` WHERE `identifier` = @identifier', { 
        '@identifier': identifier
    });

    if ( user.length > 0 ) {
        let account = await executeQuery(
            'mysql_fetch_all', 
            'SELECT `account`, `pincode` FROM `jsfour_atm` WHERE `identifier` = @identifier', { 
            '@identifier': identifier
        });

        emitNet('jsfour-atm:callback', player, {
            firstname: user[0].firstname,
            lastname: user[0].lastname,
            account: account[0].account,
            pincode: account[0].pincode,
            money: money
        }, data.CallbackID);
    }
});

// Deposit money
onNet('jsfour-atm:deposit', ( data ) => {
    let player = source;
    let amount = parseInt(data);

    // If ESX is enabled
    if ( ESX ) {
        let xPlayer = ESX.GetPlayerFromId(player);

        if ( amount <= xPlayer.getMoney() ) {
            xPlayer.removeMoney(amount);
            xPlayer.addAccountMoney('bank', amount);
            emitNet('esx:showNotification', player, `You've deposited ~s~${ amount }`);
        }
    } else {
        // Otherwise.. Add your own stuff
    }
});

// Withdraw money
onNet('jsfour-atm:withdraw', ( data ) => {
    let player = source;
    let amount = parseInt(data);

     // If ESX is enabled
     if ( ESX ) {
        let xPlayer = ESX.GetPlayerFromId(player);
        let accountMoney = xPlayer.getAccount('bank').money;

        if ( amount <= accountMoney ) {
            xPlayer.removeAccountMoney('bank', amount);
            xPlayer.addMoney(amount);
            emitNet('esx:showNotification', player, `You've withdrawed ~s~${ amount }`);
        }
    } else {
        // Otherwise.. Add your own stuff
        
    }
});

// Transfer money
onNet('jsfour-atm:transfer', async ( data ) => {
    let player = source;

    let identifier = await executeQuery(
        'mysql_fetch_all', 
        'SELECT `identifier` FROM `jsfour_atm` WHERE `account` = @account', { 
        '@account': data.receiver
    });

    if ( identifier.length > 0 ) {
        let amount = parseInt(data.amount);

        // If ESX is enabled
        if ( ESX ) {
            let xReceiver = ESX.GetPlayerFromIdentifier(identifier[0].identifier);
            let xSender = ESX.GetPlayerFromId(player);
            let accountMoney = xSender.getAccount('bank').money;

            if ( amount <= accountMoney ) {
                xSender.removeAccountMoney('bank', amount);
                xReceiver.addAccountMoney('bank', amount);

                let user = await executeQuery(
                    'mysql_fetch_all', 
                    'SELECT `firstname`, `lastname` FROM `users` WHERE `identifier` = @receiver UNION SELECT `firstname`, `lastname` FROM `users` WHERE `identifier` = @sender', { 
                    '@receiver': identifier[0].identifier,
                    '@sender': GetPlayerIdentifier(player)
                });

                if ( user.length > 0 ) {
                    emitNet('esx:showNotification', player, `You've sent ~s~${ amount } to ${ user[0].firstname }`);
                    emitNet('esx:showNotification', xReceiver.source, `You've received ~s~${ amount } from ${ user[1].firstname }`);
                }
            }
        } else {
            // Otherwise.. Add your own stuff
        }
    }
});

// Create bank account
onNet('jsfour-atm:create', async ( data ) => {
    let player = source;
    let identifier = GetPlayerIdentifier(player);
    let number = Math.floor(Math.random() * (999999999 - 111111111));

    let account = await executeQuery(
        'mysql_fetch_all', 
        'SELECT `account` FROM `jsfour_atm` WHERE `account` = @account', { 
        '@account': number
    });

    if ( account.length === 0 ) {
        let check = await executeQuery(
            'mysql_fetch_all', 
            'SELECT `identifier` FROM `jsfour_atm` WHERE `identifier` = @identifier', { 
            '@identifier': identifier
        });

        if ( check.length === 0 ) {
            executeQuery(
                'mysql_execute', 
                'INSERT INTO `jsfour_atm` (`identifier`, `account`) VALUES (@identifier, @account)', { 
                '@identifier': identifier,
                '@account': number
            });
        }
    } else {
        // Number already exists... FUCK
    }
});

// Change pincode
onNet('jsfour-atm:changePincode', ( data ) => {
    executeQuery(
        'mysql_execute', 
        'UPDATE `jsfour_atm` SET `pincode` = @pincode WHERE `account` = @account', {
        '@account': data.account,
        '@pincode': data.pincode
    });
});