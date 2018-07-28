-- *******
-- Copyright (C) JSFOUR - All Rights Reserved
-- You are not allowed to sell this script or re-upload it
-- Visit my page at https://github.com/jonassvensson4
-- Written by Jonas Svensson, July 2018
-- *******

local ESX = nil
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)

-- Get money
ESX.RegisterServerCallback('jsfour-atm:getMoney', function(source, cb)
  local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)
  local data = {
    bank = xPlayer.getAccount('bank').money,
    cash = xPlayer.getMoney()
  }
  cb(data)
end)

-- Get user info
ESX.RegisterServerCallback('jsfour-atm:getUser', function(source, cb)
  local _source = source
	local identifier = ESX.GetPlayerFromId(_source).identifier
  local userData = {}

  MySQL.Async.fetchAll('SELECT firstname, lastname FROM users WHERE identifier = @identifier', {['@identifier'] = identifier},
  function (result)
    if (result[1] ~= nil) then
      table.insert(userData, {
        firstname = result[1].firstname,
        lastname = result[1].lastname
      })
      cb(userData)
    end
  end)
end)

-- Check item
ESX.RegisterServerCallback('jsfour-atm:item', function(source, cb)
  local xPlayer = ESX.GetPlayerFromId(source)
  local item    = xPlayer.getInventoryItem('creditcard').count
  if item > 0 then
    cb(true)
  else
    cb(false)
  end
end)

-- Insert money
RegisterServerEvent('jsfour-atm:insert')
AddEventHandler('jsfour-atm:insert', function(amount)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)
	amount = tonumber(amount)
	if amount > xPlayer.getMoney() then
		print("JSFOUR-ATM: ERROR")
	else
		xPlayer.removeMoney(amount)
		xPlayer.addAccountMoney('bank', amount)
		TriggerClientEvent('esx:showNotification', _source, 'Du satte in ' .. amount .. '~s~ kr')
	end
end)

-- Take money
RegisterServerEvent('jsfour-atm:take')
AddEventHandler('jsfour-atm:take', function(amount)
	local _source = source
	local xPlayer = ESX.GetPlayerFromId(_source)
	amount = tonumber(amount)
	local accountMoney = 0
	accountMoney = xPlayer.getAccount('bank').money
	if amount > accountMoney then
		print("JSFOUR-ATM: ERROR")
	else
		xPlayer.removeAccountMoney('bank', amount)
		xPlayer.addMoney(amount)
		TriggerClientEvent('esx:showNotification', _source, 'Du tog ut ' .. amount .. '~s~ kr')
	end
end)

-- Create card *NOT IN USE*
RegisterServerEvent('jsfour-atm:createCard')
AddEventHandler('jsfour-atm:createCard', function( src )
  math.randomseed(math.floor(os.time() + math.random(1000)))

  local _source = source
  local identifier

  if src == nil then
    identifier = ESX.GetPlayerFromId(_source).identifier
  else
    identifier = ESX.GetPlayerFromId(src).identifier
  end

  local number = math.random(0000000000000000,9999999999999999)
  local code = math.random(0000,9999)

  MySQL.Async.fetchAll('SELECT number FROM creditcard WHERE number = @number', {['@number'] = number},
  function (result)
    if (result[1] == nil) then
      MySQL.Async.execute('INSERT INTO creditcard (owner, number, code) VALUES (@owner, @number, @code)',
        {
          ['@owner']      = identifier,
          ['@number']     = number,
          ['@code']       = code
        }
      )
    else
      TriggerEvent('jsfour-atm:createCard', _source)
    end
  end)
end)
