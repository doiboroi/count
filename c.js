var oContainer = "", oCurrentCoin = "", oCoinList
var today
var sLog = ""
var reldate = ""

jQuery("head").append('<style>\
.log{width:280px;height:200px;padding:5px 0 0 5px;font-size:13px;overflow-y:scroll;position:fixed;left:0;top:0;z-index:9999;background:#000;color:yellow}\
.coin-total{margin-bottom:1px;cursor:pointer;padding: 15px 5px;background: gray;}\
.coin-detail{display:none;}\
.red{color:#F00;}\
</style>')
jQuery("body").append('<div class="log">test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/></div>')

var iWaitMenu = window.setInterval(function(){

    if( window.location.href.indexOf('user/purchase') !== -1 ){
        clearInterval( iWaitMenu )
        add_log( '<a href="https://shopee.vn/user/coin" style="padding:15px; background:green;color:yellow">Go To Shopee Coin</a>' )
        log()
        return false
    }

    sLog = ( "00" + new Date().getHours() ).slice(-2) + ":" +( "00" + new Date().getMinutes() ).slice(-2) + ":" + ( "00" + new Date().getSeconds() ).slice(-2)

    if( shopee_top_exists() ){
        if( container_exists() ){
            if( coin_container_exists() ){
                if( coin_exists() ){
                    if( coin_container_next_exists() ){
                        if( left_menu_exists() ){
                            append_main_menu()
                            add_log( "Done" )
                            log()
                            // load coin

                            if( oCoinList.find(">*:eq(0) p:eq(1)").text().split(" ")[1] !== undefined ){
                                jQuery(".log").append( '<div class="coin-total" reloffset="0" reldate="'+oCoinList.find(">*:eq(0) p:eq(1)").text().split(" ")[1]+'">'+oCoinList.find(">*:eq(0) p:eq(1)").text().split(" ")[1]+' ?</div>' )
                                jQuery(".log").append( '<div class="coin-detail"></div>' )
                                clearInterval( iWaitMenu )

                                return false
                            }

                            //load_coin( 0, 5 )
                        }
                    }
                }
            }
        }
    }

    log()

}, 100)

function add_log( sText ){
    sLog += "<br/>" + sText
}

function log(){
    jQuery(".log").html( sLog )
}

function shopee_top_exists(){
    if( jQuery(".shopee-top").length ){
        add_log('1/ {.shopee-top} exists')
        return true
    }else{
        add_log('1/ {.shopee-top} <span class="red">NOT</span> exists')
    }
    return false
}

function container_exists(){
    if( jQuery(".shopee-top").next().length ){
        oContainer = jQuery(".shopee-top").next()

        add_log('2/ Container {.shopee-top.next()} exists')
        return true
    }else{
        add_log('2/ Container {.shopee-top.next()} <span class="red">NOT</span> exists')
    }
    return false
}

function coin_container_exists(){
    if( oContainer.find(">*:eq(1)>div>div>*:eq(0)").length ){

        if( oContainer.find(">*:eq(1)>div>div>*:eq(0)").text().indexOf( "Xu đang có" ) != -1 ){
            oCurrentCoin = oContainer.find(">*:eq(1)>div>div>*:eq(0)")

            add_log('3/ Coin container exists ' )
            return true
        }
    }else{
        add_log('3/ Coin container <span class="red">NOT</span> exists ' )
    }
    return false
}

function coin_exists(){
    let oCoin = oCurrentCoin.clone()

    if( oCoin.find(">div:eq(0)").html() != "--" ){
        add_log('4/ Current coin exists ' + oCoin.find(">div:eq(0)").html() )
        return true
    }else{
        add_log('4/ Current coin <span class="red">NOT</span> exists; Coin: ' + oCoin.find(">div:eq(0)").html() )
        return false
    }
}

function coin_container_next_exists(){
    if( oCurrentCoin.next().length ){

        if( oCurrentCoin.next().find('>*:eq(1)').text().indexOf( "Xu" ) != -1 ){
            oCoinList = oCurrentCoin.next().find('>*:eq(1)')
            add_log('5/ Coin container next exists ' )
            return true
        }
    }else{
        add_log('5/ Coin container next <span class="red">NOT</span> exists ' )
    }
    return false
}

function left_menu_exists(){
    //if( jQuery("._1ZnP-m").length ){
    if( oContainer.find(">div:first-child >div:last-child").length ){
        add_log('6/ Left menu exists ' )
        return true
    }else{
        add_log('6/ Left menu <span class="red">NOT</span> exists ' )
    }
    return false
}

function append_main_menu(){
    //jQuery("._1ZnP-m").append('<input style="position:fixed;left:0;top:440px;" class="user-date" />\
    //jQuery(".rhmIbk")
    oContainer.find(">div:first-child >div:last-child").append('<input style="position:fixed;left:0;top:440px;" class="user-date" />\
<div style="position:fixed;left:0;top:390px;" class="calculate-coin1">Calculate coin1</div>\
<div style="position:fixed;left:0;top:420px;" class="calculate-coin">Calculate coin <span class="mycoin"></span> </div>')
    jQuery(".user-date").val( oCoinList.find(">*:eq(0) p:eq(1)").text().split(" ")[1] )
}

jQuery("body").on("click", ".coin-total", function(){
    jQuery(this).text( jQuery(this).text().split("?").join("[Loading...]") )
    let offset = jQuery(this).attr("reloffset")
    reldate = jQuery(this).attr("reldate")
    load_coin( offset, 20 )
})

function load_coin( offset, limit ){

    jQuery.ajax({
        type: "GET",
        url: "https://shopee.vn/api/v4/coin/get_user_coin_transaction_list?type=all&offset="+offset+"&limit="+limit,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        offset: offset,
        success: function (r) {
            let ofs = parseInt( this.offset, 10 )

            if( r.error === null ){

                let bHasAnotherDate = false
                jQuery.each( r.items, function(i,v){
                    console.log( v.coin_amount )
                    if( v.coin_amount.indexOf( "-" ) == -1 && v.coin_amount != "+1.500" ){
                        let d = getDate( v.ctime )
                        let dFormat = d[0] + '-' + d[1] + '-' + d[2]
                        let iCoin = v.coin_amount.split("+").join("").split(".").join("")
                        let iID = v.id
                        let reason = v.info.reason.toLowerCase()

                        if( dFormat == reldate ){
                            if( !jQuery('div[relid="'+iID+'"]').length ){
                                jQuery(".coin-detail").append( '<div reason="'+reason+'" relid="'+ iID +'" reldate="'+dFormat+'">' + dFormat + ' <span class="my-coin">' + iCoin + '</span></div>' )
                            }
                        }else if( compare( dFormat, reldate ) == "<" ){
                            // <div class="coin-total" reloffset="0" reldate="16-04-2022">16-04-2022 ?</div>
                            if( !jQuery('div.coin-total[reldate="'+dFormat+'"]').length ){
                                let newOffset = (ofs+i-5)
                                newOffset = (newOffset<=0) ? 0 : newOffset
                                jQuery(".coin-detail").before( '<div class="coin-total" reloffset="'+newOffset+'" reldate="'+dFormat+'">'+dFormat+' ?</div>' )
                                bHasAnotherDate = true

                                calculate_total()
                                return false
                            }
                        }
                    }
                });

                if( bHasAnotherDate == false ){
                    // load 20 more date
                    load_coin( ofs+20, limit )
                }
            }else{
                alert( 'response empty. error code: ' + r.error + ". error msg: " + r.error_msg )
            }

        },
        failure: function (msg) {
        }
    });

}

function getDate( ct ){
    ct = new Date(ct * 1000)
    let day = ct.getDate()
    day = ("00" + day).slice(-2)
    let month = ct.getMonth() + 1
    month = ("00" + month).slice(-2)
    return [ day, month, ct.getFullYear()]
}
function compare( dFormat, reldate ){
    let a = dFormat.split("-")
    let b = reldate.split("-")
    a[0] = parseInt( a[0], 10 )
    a[1] = parseInt( a[1], 10 )
    a[2] = parseInt( a[2], 10 )

    b[0] = parseInt( b[0], 10 )
    b[1] = parseInt( b[1], 10 )
    b[2] = parseInt( b[2], 10 )


    if( a[2] < b[2] ) return "<";

    if( a[1] < b[1] ) return "<"
    else if( a[1] == b[1] && a[0] < b[0] ) return "<"


    return "unknow"
}

function calculate_total(){
    let iTotalCoin = 0
    let liveCount = 0
    let iLiveCoin = 0
    jQuery('.coin-detail div[reldate="'+reldate+'"] .my-coin').each(function(){
        let c = jQuery(this).text()
        c = parseInt( c, 10 )
        iTotalCoin += c
        if( jQuery(this).parent().attr("reason") == 'nhận shopee xu khi xem shopee live' ){
            liveCount++
            iLiveCoin += c
        }
        //jQuery(this).parent().css('background', 'red' )
    })

    jQuery('.coin-total[reldate="'+reldate+'"]').html( reldate + ": " + iTotalCoin + "&ensp;/ " + liveCount + " lượt" + " ("+ iLiveCoin +")" )
}

jQuery("body").on("click", ".calculate-coin", ()=>{calculateCoin(); pDown();} );
jQuery("body").on("click", ".calculate-coin1", ()=>{calculateCoin1(); } );

function calculateCoin1(){
    //today = '19-03-2022'
    today = jQuery(".user-date").val()

    calculate_today_coin()

}

function calculateCoin(){
    //today = '19-03-2022'
    today = jQuery(".user-date").val()

    var iPDownInterval = window.setInterval(function(){
        if( find_prev_day() == true ){
            clearInterval( iPDownInterval )
            calculate_today_coin()
        }
    }, 500)

}

function calculate_today_coin(){
    var iTotalCoin = 0
    oCoinList.find(">*").each(function(){
        if( jQuery(this).find('p:eq(1)').text().indexOf(today) != -1 ){
            let iCoin = jQuery(this).find(">div>*:last-child").text()
            console.log( "coin: " + iCoin )
            if( iCoin.indexOf('.') != -1 ) iCoin = iCoin.split('.').join('')
            iCoin = parseInt( iCoin, 10 )
            if( iCoin > 0 && iCoin != 1500){
                console.log( iCoin )
                iTotalCoin += iCoin
            }
        }
    })

    jQuery(".mycoin").text( today + ": " + iTotalCoin )
}

function find_prev_day(){
    var bHasPrevDay = false
    pDown()

    oCoinList.find(">*").each(function(){
        let p = jQuery(this).find('p:eq(1)')
        if( p.text().indexOf( today ) == -1 && p.text().split(" ")[1].split("-")[0] < today.split('-')[0] ){
            console.log( p.text() )
            bHasPrevDay = true
            return false
        }
    })

    return bHasPrevDay

}

function pDown(){
    let wH = window.innerHeight
	let wSc = jQuery(window).scrollTop()

	let onePage = wH + wSc - 70
	jQuery(window).scrollTop( onePage )
}
