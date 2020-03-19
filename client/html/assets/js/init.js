$( document ).ready(function(){
    let code = '';
    let card = false;
    let insert = false;
    let inside = false;
    let taking = false;
    let cash = 0;
    let bank = 0;
    let userPincode = 1111;

    let clickSound = new Howl({
        src: ['assets/sounds/click.ogg'],
        volume: 0.35,
    });

    let insertSound = new Howl({
        src: ['assets/sounds/insert.ogg?v=4'],
        volume: 0.3,
    });

    let moneySound = new Howl({
        src: ['assets/sounds/money.ogg?v=2'],
        volume: 0.5,
    });

    let errorSound = new Howl({
        src: ['assets/sounds/error.ogg?v=2'],
        volume: 0.5,
    });
    
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case 'openATM':
                if ( Object.keys( event.data ).length > 1 ) {
                    if ( !taking ) {
                        $('#wrapper').show();
                        $('#header p').text(event.data.user.money.bank);
                    } else {
                        fetch(`https://jsfour-atm/jsfour-atm:error`);
                    }
                    
                    cash = event.data.user.money.cash;
                    bank = event.data.user.money.bank;
                    userPincode = event.data.user.pincode;
                } else {
                    $('#wrapper').show();
                }
                break;
            case 'openBank':
                if ( Object.keys( event.data ).length > 1 ) {
                    window.location.href = `
                        bank.html?cash=${ event.data.user.money.cash }
                        &bank=${ event.data.user.money.bank }
                        &type=${ event.data.type }
                        &firstname=${ event.data.user.firstname }
                        &lastname=${ event.data.user.lastname }
                        &account=${ event.data.user.account }
                        &pincode=${ event.data.user.pincode }
                    `;
                }
                break;
            case 'correct':
                $('#code').hide();
                $('#display').show();
                $('#display #take').show();
                break;
        }
    });

    function offsetBottom(el, i) {
        i = i || 0; return $(el)[i].getBoundingClientRect().bottom
    }

    $('#cardflash').click(function(){
        if (!card) {
            if(offsetBottom('#card') == 1069 || offsetBottom('#card') == 1253) {
                $('#card').addClass('card-anim');
                let bottom = offsetBottom('#card');
                let i = 150;
                let interval = setInterval(function () {
                    bottom = offsetBottom('#card');
                    i--;
                    if ( bottom <= 648) {
                        insertSound.play();
                        clearInterval(interval);
                        card = true;
                        $('#card').css('height', i);
                        $('#card').hide();
                        $('#welcome img').attr('src', 'assets/images/welcome_code.png');
                    }
                }, 1);
            }
        }
    });

    $('#code-button').click(function(){
        if (card && !inside) {
            $('#code').show();
        }
    });

    $("#b-cancel").click(function() {
        if (card && inside) {
            clickSound.play();
            resetAll();
            $('#wrapper').hide();
            fetch(`https://jsfour-atm/jsfour-atm:close`);
        }
    });

    $('.take-money').click(function(){
        if (card && inside) {
            clickSound.play();
            let amount = $(this).attr('data-amount');

            if (insert) {
                if (cash > 0) {
                    if (amount == 2000) {
                        // Insert all
                        if (inside) {
                            $('#header p').text( parseInt($('#header p').text()) + parseInt(cash));
                            fetch(`https://jsfour-atm/jsfour-atm:deposit`, {
                                method: 'POST',
                                body: bank + cash
                            });

                            bank = parseInt(cash) + parseInt(bank);
                            cash = 0;
                        }
                    } else {
                        // Insert amount
                        if (inside) {
                            $('#header p').text( parseInt($('#header p').text()) + parseInt(amount));
                            fetch(`https://jsfour-atm/jsfour-atm:deposit`, {
                                method: 'POST',
                                body: cash
                            });

                            cash = parseInt(cash) - parseInt(amount);
                            bank = parseInt(cash) + parseInt(amount);
                        }
                    }
                }
            } else {
                if (!taking) {
                    if (bank > 0 && bank > amount) {
                        taking = true;
                        $('#display #insert').hide();
                        $('#display #take').hide();
                        $('#display').hide();
                        $('#bank #loading').show();
                        moneySound.play();

                        setTimeout(function() {
                            $('#money').show();
                            $('#receipt').show();

                            setTimeout(function() {
                                $('#money').attr('src', 'assets/images/money.gif');
                                $('#money').hide();
                                $('#receipt').attr('src', 'assets/images/receipt.gif');
                                $('#receipt').hide();
                                $('#bank #loading').hide();
                                $('#display').show();

                                if (insert && inside) {
                                    $('#display #insert').show();
                                } else if(!insert && inside) {
                                    $('#display #take').show();
                                } else {
                                    $('#header').hide();
                                }
                                
                                taking = false;

                                if (inside) {
                                    $('#header p').text( parseInt($('#header p').text()) - parseInt(amount));
        
                                    fetch(`https://jsfour-atm/jsfour-atm:withdraw`, {
                                        method: 'POST',
                                        body: amount
                                    });
                           
                                    cash = parseInt(cash) + parseInt(amount);
                                }
                            }, 3800);
                        }, 5600);
                    }
                }
            }
        }
    });

    $("body").on("click", "#insert-money", function() {
        clickSound.play();
        if (!insert) {
            insert = true;
            $('#display #take').hide();
            $('#display #insert').show();
        } else {
            insert = false;
            $('#display #insert').hide();
            $('#display #take').show();
        }
    });

    $('#cancel').click(function(){
        clickSound.play();
        resetAll();
    });

    $('#wrong').click(function(){
        clickSound.play();
        $('#code h1').text('');
        code = '';
    });

    $('#done').click(function(){
        clickSound.play();

        if (code.length == 4) {
            $('#code').hide();
            $('#welcome').hide();
            $('#error').hide();

            if (parseInt(code) === userPincode) {
                $('#bank #loading').show();
                setTimeout(function(){
                $('#bank #loading').hide();
                $('#display').show();
                $('#display #take').show();
                $('#header').show();
                inside = true;
                }, 1000);
            } else {
                $('#code h1').text('');
                code = '';
                $('#error').show();
                errorSound.play();
                setTimeout(function(){
                errorSound.stop();
                $('#error').hide();
                $('#welcome').show();
                }, 3000);
            }
        }
    });

    $('#small li').click(function(){
        clickSound.play();
        let txt = $('#code h1').text();

        if (txt.length != 4) {
            $('#code h1').text(txt + '*');
            code = code + $(this).text();
        }
    });

    function resetAll() {
        clickSound.stop();
        errorSound.stop();
        moneySound.stop();
        insertSound.stop();
        $('#error').hide();
        $('#card').show();
        inside = false;
        insert = false;
        card = false;
        transaction = false;
        code = '';
        $('#header').hide();
        $('#code').hide();
        $('#display').hide();
        $('#card').removeClass('card-anim');
        $('#card').css('height', '150px');
        $('#welcome img').attr('src', 'assets/images/welcome.png');
        $('#code').hide();
        $("#insert").hide();
        $('#code h1').text('');
        $('#display').hide();
        $('#display #take').hide();
        $('#display #insert').hide();
        $('#bank #loading').hide();
        $('#paper').hide();
        $('#welcome').show();
    }

    // Escape key event + reset the page
    $(document).keyup(function(e) {
        if ( e.keyCode == 27 ) {
            resetAll();
            window.location.href = 'index.html';
            $('#wrapper').hide();
            fetch(`https://jsfour-atm/jsfour-atm:close`);
        }
    });
});
