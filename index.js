let moneys = {
    buy_amount: 0,
    // sell_amount: 0,
    current_profit: 0,
}




//TODO でかい広告も自動削除したい
const detectAd = () => {
    let ad = document.querySelector("body > div.js-rootresizer__contents > div.layout__area--center > div:nth-child(3) > div article")

    if (ad) {
        console.log("ad detected")
        ad.querySelector("button").click()
    }
}

const logMoney = () => console.log(moneys)


const getClosingPrice = () => {
    
    let closingPrice = Number(document.getElementsByClassName("valueValue-3kA0oJs5")[4].innerHTML)
    console.log("CLOSINGPRICE:", closingPrice)

    if (isNaN(closingPrice)) {
        window.alert("終値を表示してください")
    }

    return closingPrice
}

const addBuyCount = () => {

    let buy_countHTML = document.getElementById("buy_count")
    buy_countHTML.innerHTML = Number(buy_countHTML.innerHTML) + 1
    let buy_count = buy_countHTML.innerHTML

    //buy_amountに購入した株の終値を追加
    moneys.buy_amount = parseInt((moneys.buy_amount + getClosingPrice()) / buy_count) * buy_count
    //平均値をとる
    console.log("NEW BUY_AMOUNT: ",moneys.buy_amount)
    calculateBuyNormal(moneys.buy_amount)

    logMoney()
}

//TODO　利確
const lessenBuyCount = () => {
    let buy_countHTML = document.getElementById("buy_count")
    if (buy_count.innerHTML != 0) {
        //先にトレード結果 += 更新される前の現在の損益 / 更新される前の買い個数
        calculateTradeResult()
        
        
        //個数へらす前の買い平均を　取得
        let buy_normal = calculateBuyNormal(moneys.buy_amount)
        //buy_amountはbuy_normal*1分下がる
        moneys.buy_amount -= buy_normal
        //個数をへらしたので平均を　更新
        calculateBuyNormal(moneys.buy_amount)

        //buy_countをへらす
        buy_countHTML.innerHTML = Number(buy_countHTML.innerHTML) - 1
        

        //buy_amountとbuy_countがへった状態で現在の損益を更新
        calculateCurrentProfit()
        
    }

    logMoney()
}


// const addSellCount = () => {
//     let sell_countHTML = document.getElementById("sell_count")
//     sell_countHTML.innerHTML = Number(sell_countHTML.innerHTML) + 1
//     let sell_count = sell_countHTML.innerHTML

//     //sell_amountに空売りした株の終値を追加
//     moneys.sell_amount = parseInt((moneys.sell_amount + getClosingPrice())/sell_count) * sell_count
//     //平均値をとる
//     console.log("NEW SELL_AMOUNT: ",moneys.sell_amount)
//     calculateSellNormal(moneys.sell_amount)

//     logMoney()
// }
// //TODO
// const lessenSellCount = () => {
//     let sell_countHTML = document.getElementById("sell_count")
//     if (sell_count.innerHTML != 0) {
//         //先にトレード結果 += 更新される前の現在の損益 / 更新される前の買い個数になっているが、売りも導入するのは難しい。
//         //TODO 売りにも対応させる
//         calculateTradeResult()
        
        
//         //個数へらす前の売り平均を　取得
//         let sell_normal = calculateSellNormal(moneys.sell_amount)
//         //sell_amountはsell_normal*1分下がる
//         moneys.sell_amount -= sell_normal
//         //個数をへらしたので平均を　更新
//         calculateSellNormal(moneys.sell_amount)

//         //sell_countをへらす
//         sell_countHTML.innerHTML = Number(sell_countHTML.innerHTML) - 1
        
//         //TODO 売りにも対応させる
//         //sell_amountとsell_countがへった状態で現在の損益を更新
//         calculateCurrentProfit()
        
//     }

//     logMoney()
// }


const calculateBuyNormal = (buy_amount) => {
    let buy_count = Number(document.getElementById("buy_count").innerHTML)
    //buy_amountを０でわるのを防ぐ
    if (!buy_count) {
        console.log('buy_normal became 0')
        document.getElementById("buy_normal").innerHTML = 0
        return 0
    } else {
        let buy_normal = parseInt(buy_amount / buy_count)
        console.log('BUYS:acn', buy_amount, buy_count, buy_normal)
        document.getElementById("buy_normal").innerHTML = buy_normal
        return buy_normal
    }
}



// const calculateSellNormal = (sell_amount) => {
//     let sell_count = Number(document.getElementById("sell_count").innerHTML)
//     //sell_amountを０で割るのを防ぐ
//     if (!sell_count) {
//         console.log('sell_normal became 0')
//         document.getElementById("sell_normal").innerHTML = 0
//         return 0
//     } else {
//         let sell_normal = parseInt(sell_amount / sell_count)
//         console.log('SELLS:acn', sell_amount, sell_count, sell_normal)
//         document.getElementById("sell_normal").innerHTML = sell_normal
//         return sell_normal
//     }
// }

//現在の損益 = 今の終値*buy_count - buy_amount
const calculateCurrentProfit = () => {
    let buy_count = Number(document.getElementById("buy_count").innerHTML)
    let closingPrice = getClosingPrice()

    moneys.current_profit = (closingPrice * buy_count) - moneys.buy_amount
    document.getElementById("current_profit").innerHTML = moneys.current_profit

    logMoney()
    document.body.style.pointerEvents ="auto"
}

//買い- 売り
const calculateTradeResult = () => {
    //countは減ったが買い平均はそのままでいい。
    let trade_resultHMTL = document.getElementById("trade_result")
    //確定した利益（買いの場合）は　終値-買い平均
    let buy_normal = calculateBuyNormal(moneys.buy_amount)
    
    //結果を更新
    trade_resultHMTL.innerHTML = Number(trade_resultHMTL.innerHTML) + getClosingPrice() - buy_normal
}

//TODO 全決済したときの計算
const settleAll = () => {
    let trade_resultHMTL = document.getElementById("trade_result")
    trade_resultHMTL.innerHTML = Number(trade_resultHMTL.innerHTML) + moneys.current_profit
    


    //先にbuy_countを０に
    document.getElementById("buy_count").innerHTML = 0

    //buy_amountを0に
    moneys.buy_amount = 0
        //buy_normalも0に
    calculateBuyNormal(moneys.buy_amount)
        //buy_countも0に
    calculateCurrentProfit()
}

const moveDateDelay = () => {
    document.body.style.pointerEvents = "none"
    setTimeout(calculateCurrentProfit, 500)
}



window.addEventListener("load", () => {
    let body = document.body;

    setInterval(detectAd, 1000)

    let startDemotradeButton = `<button id="start_demotrade" style="    color: #eee;
    display: inline-block;
    position: absolute;
    top: 100px;
    left: 300px;
    padding: 7px 10px;
    background-color: #131722;
    border: 1px solid #eeeeee2e;">Start Demo Trade</button>`

    body.insertAdjacentHTML('beforeend', startDemotradeButton)

    let startDemotradeHTML = document.getElementById("start_demotrade")

    startDemotradeHTML.addEventListener("click", () => {
        //check if replay mode or not 
        let moveDateButton = document.querySelector("body > div.tv-floating-toolbar.tv-replay-toolbar.tv-grouped-floating-toolbar.ui-draggable > div > div.tv-floating-toolbar__content.js-content > div:nth-child(3) > div")
        if (moveDateButton) {
            startDemotradeHTML.style.display = "none"
            console.log("demo trade start")

            let tradeDiv = `
            <div id="myTrade" style="min-width:150px; background:rgba(255,255,255,0.7); color:black;  display:inline-block; position:absolute; top:100px; left:300px; text-align:center; align-items:center;">
                <div style="display:flex; justify-content:space-around; ">
                    <p>現在の損益</p>
                    <p><span id="current_profit">0</span>円</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p>トレード結果</p>
                    <p><span id="trade_result">0</span>円</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <!-- 売 -->
                    <p>買</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <!-- sell_normal -->
                    <p><span id="buy_normal">0</span>円</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <!-- sell_count -->
                    <p id="buy_count">0</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <!-- sell_plus -->
                    <p id="buy_plus" style="padding:2px 20px; background:#2bd860a1;  margin-bottom:3px;">買＋</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                <p id="buy_minus" style="padding:2px 20px; background:#ef53509e;  margin-bottom:3px;">買－</p>
                    <!--売りー  -->
                </div>
                <p id="settle_all" style="margin:7px 10px;">全決算</p>
            </div>
        `
        body.insertAdjacentHTML('beforeend', tradeDiv)
    
        document.getElementById("buy_plus").addEventListener("click", addBuyCount)
        document.getElementById("buy_minus").addEventListener("click", lessenBuyCount)
        //売りのDOM操作
        // document.getElementById("sell_plus").addEventListener("click", addSellCount)
        // document.getElementById("sell_minus").addEventListener("click", lessenSellCount)
        document.getElementById("settle_all").addEventListener("dblclick", settleAll)
        moveDateButton.addEventListener("click",moveDateDelay)
    

        } else {
            alert("Enable replay mode beforehand")
        }
    })
})

//<p>売</p>
//<p><span id="sell_normal">0</span>円</p>
//<p id="sell_count">0</p>
//<p id="sell_plus" style="padding:2px 20px; background:#ff6b6b;  margin-bottom:3px;">売＋</p>
//<p id="sell_minus" style="padding:2px 20px; background:#ff6b6b;  margin-bottom:3px;">売－</p>