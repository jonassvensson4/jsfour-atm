$('#paper').show();
var win = 3;

// URL parameter
var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

var cash = getUrlParameter('cash');
var bank = getUrlParameter('bank');
var type = getUrlParameter('type');

$('#senderAcc').val(getUrlParameter('account'));
$('#takeAcc').val(getUrlParameter('account'));
$('.firstname').val(getUrlParameter('firstname'));
$('.lastname').val(getUrlParameter('lastname'));
$('.saldo').text('Saldo: ' + bank);

// Fleeca Banking
function fleeca() {
  $('body').removeClass('blaine');
  $('body').removeClass('pacific');
  $('#header img').css('margin-top', '0');
  $('#header img').attr('src', 'assets/images/fleeca.png');
  $('#welcome').text('Välkommen till Fleeca Banking!');
}

// Blaine County
function blaine() {
  $('body').addClass('blaine');
  $('#header img').css('margin-top', '-10px');
  $('#header img').attr('src', 'assets/images/blaine.png');
  $('#welcome').text('Välkommen till Blaine County!');
}

// Pacific Standards
function pacific() {
  $('body').addClass('pacific');
  $('#header img').css('margin-top', '-10px');
  $('#header img').attr('src', 'assets/images/pacific.png');
  $('#welcome').text('Välkommen till Pacific Standards!');
}

// Change bank layout
if ( type == 'fleeca' ) {
  fleeca();
} else if ( type == 'blaine' ) {
  blaine();
} else {
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
    var amount = $('#take-amount').val();

    if ( amount.toLowerCase() == 'allt' && cash > 0) {
      $.post('http://jsfour-atm/insert', JSON.stringify({ money : cash }));

      bank = parseInt(bank) + parseInt(cash);
      cash = parseInt(cash) - parseInt(cash);

      $('.saldo').text('Saldo: ' + bank.toString());
    } else if ( amount > 0 && amount != null && amount != ' ' && cash > 0 ) {
      if ( parseInt(cash) >= parseInt(amount) ) {
        $.post('http://jsfour-atm/insert', JSON.stringify({ money : amount }));

        cash = parseInt(cash) - parseInt(amount);
        bank = parseInt(bank) + parseInt(amount);

        $('.saldo').text('Saldo: ' + bank.toString());
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
    var amount = $('#take-amount').val();

    if ( amount.toLowerCase() == 'allt' && cash > 0) {
      $.post('http://jsfour-atm/insert', JSON.stringify({ money : cash }));

      bank = parseInt(bank) + parseInt(cash);
      cash = parseInt(cash) - parseInt(cash);

      $('.saldo').text('Saldo: ' + bank.toString());
    } else if ( amount > 0 && amount != null && amount != ' ' && bank > 0 ) {
      if ( parseInt(bank) >= parseInt(amount) ) {
        $.post('http://jsfour-atm/take', JSON.stringify({ money : amount }));

        cash = parseInt(cash) + parseInt(amount);
        bank = parseInt(bank) - parseInt(amount);

        $('.saldo').text('Saldo: ' + bank.toString());
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
    var anumb = $('#receiverAcc').val();
    var onumb = $('#orgnumb').val();
    var amount = $('#transfer-amount').val();

    if ( amount > 0 && amount != null && amount != ' ' && bank > 0 && anumb.length > 0 ) {
      if ( parseInt(bank) >= parseInt(amount) ) {
        $.post('http://jsfour-atm/transfer', JSON.stringify({ money : amount, account : anumb }));

        bank = parseInt(bank) - parseInt(amount);

        $('.saldo').text('Saldo: ' + bank);
      }
    }
  }
});

$('h1, h2, p').mousedown(function() {
  return false;
});

// Disable form submit
$("form").submit(function() {
	return false;
});
