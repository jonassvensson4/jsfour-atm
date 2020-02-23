$('#paper').show();
let win = 3;

// URL parameter
let getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for ( i = 0; i < sURLVariables.length; i++ ) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

let cash = getUrlParameter('cash');
let bank = getUrlParameter('bank');
let type = getUrlParameter('type');
let pincode = getUrlParameter('pincode');
let account = getUrlParameter('account');

$('#senderAcc').val(account);
$('#takeAcc').val(account);
$('.firstname').val(getUrlParameter('firstname'));
$('.lastname').val(getUrlParameter('lastname'));
$('.saldo').text(`Balance: ${ bank }`);

// Fleeca Banking
function fleeca() {
    $('body').removeClass('blaine');
    $('body').removeClass('pacific');
    $('#header img').css('margin-top', '0');
    $('#header img').attr('src', 'assets/images/fleeca.png');
    $('#welcome').text('Welcome to Fleeca Banking!');
}

// Blaine County
function blaine() {
    $('body').addClass('blaine');
    $('#header img').css('margin-top', '-10px');
    $('#header img').attr('src', 'assets/images/blaine.png');
    $('#welcome').text('Welcome to Blaine County!');
}

// Pacific Standards
function pacific() {
    $('body').addClass('pacific');
    $('#header img').css('margin-top', '-10px');
    $('#header img').attr('src', 'assets/images/pacific.png');
    $('#welcome').text('Welcome to Pacific Standards!');
}

// Change bank layout
if ( type === 'fleeca' ) {
    fleeca();
} else if ( type == 'blaine' ) {
    blaine();
} else if ( type == 'pacific' ) {
    pacific();
}

// Deposit money
$('#deposit').click(function() {
    if ( win > 1 ) {
        win = 1;
        $('#transaction-form').hide();
        $('#home').hide();
        $('#take-form').show();
    } else {
        let amount = $('#take-amount').val();

        if ( amount.toLowerCase() === 'all' && cash > 0) {
            fetch(`https://jsfour-atm/jsfour-atm:deposit`, {
                method: 'POST',
                body: cash
            });

            bank = parseInt(bank) + parseInt(cash);
            cash = parseInt(cash) - parseInt(cash);

            $('.saldo').text('Balance: ' + bank.toString());
        } else if ( amount > 0 && amount != null && amount != ' ' && cash > 0 ) {
            if ( parseInt(cash) >= parseInt(amount) ) {
                fetch(`https://jsfour-atm/jsfour-atm:deposit`, {
                    method: 'POST',
                    body: amount
                });

                cash = parseInt(cash) - parseInt(amount);
                bank = parseInt(bank) + parseInt(amount);

                $('.saldo').text('Balance: ' + bank.toString());
            }
        }
    }
});

// Withdraw money
$('#withdraw').click(function() {
    if ( win > 1 ) {
        win = 1;
        $('#transaction-form').hide();
        $('#home').hide();
        $('#take-form').show();
    } else {
        let amount = $('#take-amount').val();

        if ( amount.toLowerCase() === 'all' && cash > 0) {
            fetch(`https://jsfour-atm/jsfour-atm:withdraw`, {
                method: 'POST',
                body: cash
            });

            bank = parseInt(bank) + parseInt(cash);
            cash = parseInt(cash) - parseInt(cash);

            $('.saldo').text('Balance: ' + bank.toString());
        } else if ( amount > 0 && amount != null && amount != ' ' && bank > 0 ) {
            if ( parseInt(bank) >= parseInt(amount) ) {
                fetch(`https://jsfour-atm/jsfour-atm:withdraw`, {
                    method: 'POST',
                    body: amount
                });

                cash = parseInt(cash) + parseInt(amount);
                bank = parseInt(bank) - parseInt(amount);

                $('.saldo').text('Balance: ' + bank.toString());
            }
        }
    }
});

// Transfer money
$('#transfer').click(function() {
    if ( win < 2 || win > 2 ) {
        win = 2;
        $('#take-form').hide();
        $('#home').hide();
        $('#transaction-form').show();
    } else {
        let anumb = $('#receiverAcc').val();
        let onumb = $('#orgnumb').val();
        let amount = $('#transfer-amount').val();

        if ( amount > 0 && amount != null && amount != ' ' && bank > 0 && anumb.length > 0 ) {
            if ( parseInt(bank) >= parseInt(amount) ) {
                fetch(`https://jsfour-atm/jsfour-atm:transfer`, {
                    method: 'POST',
                    body: JSON.stringify({
                        money: amount,
                        account: anumb
                    })
                });

                bank = parseInt(bank) - parseInt(amount);

                $('.saldo').text('Balance: ' + bank);
            }
        }
    }
});

// Submit change pincode form
$('#pincode-submit').click(function() {
    $('.wrong').removeClass('wrong');

    let empty = false;

    // Check for empty input fields
    $('#pincode-form').find('input').each(function() {
        if ( $( this ).val().length < 4 ) {
            empty = true;
        };
    });

    // No fields are empty.. Continue
    if ( !empty ) {
        // Check if the current inptued pincode matches the users pincode
        if ( $('#pincode-current').val() === pincode ) {
            // Checks if the new pincode matches the confirm 
            if ( $('#pincode-new').val() === $('#pincode-confirm').val() ) {
                fetch(`https://jsfour-atm/jsfour-atm:changePincode`, {
                    method: 'POST',
                    body: JSON.stringify({
                        account: account,
                        pincode: $('#pincode-new').val()
                    })
                });

                window.location.href = 'index.html';
                $('#wrapper').hide();
                fetch(`https://jsfour-atm/jsfour-atm:close`);
            } else {
                $('#pincode-new, #pincode-confirm').parent().addClass('wrong');
            }
        } else {
            $('#pincode-current').parent().addClass('wrong');
        }
    }
});

// Go back to starting page
$('.to-start').click(() => {
    $('#transaction-form').hide();
    $('#take-form').hide();
    $('#home').show();
});

$('h1, h2, p').mousedown(function() {
    return false;
});

// Disable form submit
$("form").submit(function() {
	return false;
});
