let moneys = {
    buy_amount: 0,
    sell_amount: 0,
    current_profit: 0,
    trade_result: 0,
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

const addBuyCount =  () => {
    let buy_count = document.getElementById("buy_count")
    buy_count.innerHTML = Number(buy_count.innerHTML) + 1

    //終値をbuy_amountに加算
    moneys.buy_amount += getClosingPrice()
    //平均値をとる
    culculateBuyNormal(moneys.buy_amount)

    logMoney()
}

//TODO　利確
const lessenBuyCount = () => {
    let buy_count = document.getElementById("buy_count")
    if (buy_count.innerHTML != 0) {
        buy_count.innerHTML = Number(buy_count.innerHTML) - 1

        //buy_amountから終値をひく
        moneys.buy_amount -= getClosingPrice()
        culculateBuyNormal(moneys.buy_amount)
    }

    logMoney()
}

//TODO 
const addSellCount = () => {
    let sell_count = document.getElementById("sell_count")
    sell_count.innerHTML = Number(sell_count.innerHTML) + 1

    logMoney()
}
//TODO
const lessenSellCount = () => {
    let sell_count = document.getElementById("sell_count")
    if (sell_count.innerHTML != 0) {
        sell_count.innerHTML = Number(sell_count.innerHTML) - 1
    }

    logMoney()
}

const culculateBuyNormal = (buy_amount) => {
    let buy_count = Number(document.getElementById("buy_count").innerHTML)
    //buy_amountを０でわるのを防ぐ
    if (buy_count == 0) {
        document.getElementById("buy_normal").innerHTML = 0
    } else {
        buy_normal = parseInt(buy_amount / buy_count)
        document.getElementById("buy_normal").innerHTML = buy_normal
    }
}

//TODO
const culculateSellNormal = "something";

const culculateCurrentProfit = () => {
    document.body.style.pointerEvents = "none"
    //先に日送りを実行させるためのsetTImeout
    setTimeout(() => {
        let buy_count = Number(document.getElementById("buy_count").innerHTML)
        let closingPrice = getClosingPrice()
    
        moneys.current_profit = (closingPrice * buy_count) - moneys.buy_amount
        document.getElementById("current_profit").innerHTML = moneys.current_profit
    
        logMoney()
        document.body.style.pointerEvents ="auto"
    }, 500)
}

//TODO 全決済したときの計算
const settleAll = () => {
    let buy_count = document.getElementById("buy_count")
    let sell_count = document.getElementById("sell_count")
    buy_count.innerHTML = 0
    sell_count.innerHTML = 0
}




window.addEventListener("load", () => {
    let body = document.body;

    setInterval(detectAd, 1000)

    let startDemotradeButton = `<button id="start_demotrade" style="color:white; display:inline-block; position:absolute; top:100px; left:300px;">Start Demo Trade</button>`

    body.insertAdjacentHTML('beforeend', startDemotradeButton)

    let startDemotradeHTML = document.getElementById("start_demotrade")

    startDemotradeHTML.addEventListener("click", () => {
        //check if replay mode or not 
        let moveDateButton = document.querySelector("body > div.tv-floating-toolbar.tv-replay-toolbar.tv-grouped-floating-toolbar.ui-draggable > div > div.tv-floating-toolbar__content.js-content > div:nth-child(3) > div")
        if (moveDateButton) {
            startDemotradeHTML.style.display = "none"
            console.log("demo trade start")

            let tradeDiv = `
            <div id="myTrade" style="background:rgba(255,255,255,0.7); color:black;  display:inline-block; position:absolute; top:100px; left:300px; text-align:center; align-items:center;">
                <div style="display:flex; justify-content:space-around; ">
                    <p>現在の損益</p>
                    <p><span id="current_profit">0</span>円</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p>トレード結果</p>
                    <p><span>0</span>円</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p>売</p>
                    <p>買</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p><span id="sell_normal">0</span>円</p>
                    <p><span id="buy_normal">0</span>円</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p id="sell_count">0</p>
                    <p id="buy_count">0</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p id="sell_plus" style="padding:2px 20px; background:#ff6b6b;  margin-bottom:3px;">売＋</p>
                    <p id="buy_plus" style="padding:2px 20px; background:#7be279;  margin-bottom:3px;">買＋</p>
                </div>
                <div style="display:flex; justify-content:space-around; ">
                    <p id="sell_minus" style="padding:2px 20px; background:#ff6b6b;  margin-bottom:3px;">売－</p>
                    <p id="buy_minus" style="padding:2px 20px; background:#7be279;  margin-bottom:3px;">買－</p>
                </div>
                <p id="settle_all" style="margin:7px 10px;">全決算</p>
            </div>
        `
        body.insertAdjacentHTML('beforeend', tradeDiv)
    
        document.getElementById("buy_plus").addEventListener("click", addBuyCount)
        document.getElementById("buy_minus").addEventListener("click", lessenBuyCount)
        document.getElementById("sell_plus").addEventListener("click", addSellCount)
        document.getElementById("sell_minus").addEventListener("click", lessenSellCount)
        document.getElementById("settle_all").addEventListener("dblclick", settleAll)
        moveDateButton.addEventListener("click",culculateCurrentProfit)
    

        } else {
            alert("Enable replay mode beforehand")
        }
    })
})
