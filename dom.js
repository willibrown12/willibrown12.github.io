
/*  ==================global  ================== ==============================*/
let scrollHandler;

const livePricing=[]
let myChart={}
let myInterval
const cache = {};
const loader = document.querySelector("#progressbar")
const loaderkid = document.querySelector("#progressbarkid")
let coins=[]
let myOffcanvas = document.getElementById('offcanvasExample')
let bsOffcanvas = new bootstrap.Offcanvas(myOffcanvas)





async function init() {

/*  ==================pages conatainers to use ================== */
const coinList = document.querySelector("#homepage")
const liveReportdiv = document.querySelector("#liveReportdiv")
const aboutdiv = document.querySelector("#aboutdiv")
liveReportdiv.classList.add("d-none")
aboutdiv.classList.add("d-none")

   /*  ==================load main page ================== */
    homepage()



/*  ==================homepage ================== */

    const homebutton = document.querySelector("#home")
    homebutton.addEventListener("click",  () => {
        
        homebutton.classList.add("active")
        liveReport.classList.remove("active")
        about.classList.remove("active")
        aboutdiv.classList.add("d-none")
        
        liveReportdiv.classList.add("d-none")

         homepage()
    
    })


    /*  ==================liveReport ================== */
    const liveReport = document.querySelector("#liveReport")
    liveReport.addEventListener("click", async () => {
       
        liveReport.classList.add("active")
        homebutton.classList.remove("active")
        about.classList.remove("active")
        coinList.classList.add("d-none")

        
        aboutdiv.classList.add("d-none")
      
       
        await showLiveReport()
        
    
    })


    /*  ==================about ================== */
    const about = document.querySelector("#about")
    about.addEventListener("click", () => {
        about.classList.add("active")
        liveReport.classList.remove("active")
        homebutton.classList.remove("active")
        coinList.classList.add("d-none")
        liveReportdiv.classList.add("d-none")

        aboutPage()
    
    })
   
    

 
    
}



    /*  ==================loading the home page  ================== */

async function homepage() {
    const spinner= document.querySelector("#spinner")
    try {
        spinner.classList.remove("d-none")
        clearInterval(myInterval)
        const coinList = document.querySelector("#homepage")
        coinList.classList.remove("d-none")


        if (coins[0]===undefined) {
          coins=await getCoins()
      } 
      

        searchcoin(coins)

  /*  ==================search button  ================== */


       const buttonSrch= document.querySelector("#buttonSrch")
    buttonSrch.addEventListener("click",() => {
        searchcoin(coins)})
       const showfavorites= document.querySelector("#showfavorites")
       showfavorites.addEventListener("click", ()=>{draw(livePricing)
        
       })


        /*  ==================off canvas add button  ================== */
       
        const buttonadd = document.querySelector("#buttonadd")
      
        buttonadd.addEventListener("click",()=>{
            if (livePricing.length>5) {
                alert("you need to uncheck coin");
                
            }
        else{
            bsOffcanvas.hide()
            draw(coins)
        }})
 /*  ==================off canvas cancel button  ================== */
        const buttoncancel = document.querySelector("#buttoncancel") 
        buttoncancel.addEventListener("click",()=>{

        
           
            if (livePricing.length===6) {
                const findlastcoin=coins.find((coin)=> coin.id===livePricing[5].id,)
                findlastcoin.ischecked=false
                livePricing.pop()
                
            }
            bsOffcanvas.hide()
            draw(coins) }
        )
 

 /*  ==================draw first time  ================== */
        
        
    } catch (error) {
        
    }finally{
      
        spinner.classList.add("d-none")
     
    }
  
}

async function showLiveReport() {

     /*  ==================loading page  ================== */
    clearInterval(myInterval)
    const liveReportdiv = document.querySelector("#liveReportdiv")
    const ctx = document.getElementById('myChart');
    liveReportdiv.classList.remove("d-none")
  
 /*  ==================fatch data  ================== */

   const data=await getCoinliveprice()

    /*  ==================crate chart  ================== */
   const event = new Date
 
   if(myChart.id===0){
     myChart.destroy()
}
      
   myChart=new Chart(ctx, {
        type: 'line',
        data: {
          labels: [event.toLocaleTimeString()],
          datasets: [{
            label: Object.keys(data)[0]|| "no data",
            data: [Object.values(data)[0]?.USD,],
            borderWidth: 1
          },{
            label:Object.keys(data)[1]|| "no data",
            data: [Object.values(data)[1]?.USD,],
            borderWidth: 1
          },
          {
            label:Object.keys(data)[2] || "no data",
            data: [Object.values(data)[2]?.USD,],
            borderWidth: 1
          },
          {
            label:Object.keys(data)[3]|| "no data",
            data: [Object.values(data)[3]?.USD, ],
            borderWidth: 1
          },
          {
            label:Object.keys(data)[4]|| "no data",
            data: [Object.values(data)[4]?.USD,],
            borderWidth: 1
          }],
        },
        options: {
            plugins: {
                tooltip: {
                  callbacks: {
                    label: (ctx) => (`${ctx.dataset.label}: ${ctx.raw}`)
                  }
                }
              },
            
          
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      myChart.id=0
     


       /*  ==================set Interval to get data and updata chart   ================== */
      
   myInterval =setInterval(() => {
        Promise.all([getCoinliveprice()]).then((results) => {
           let timeevent= new Date
         
            addData(myChart, timeevent.toLocaleTimeString(), Object.values(results[0]))
        results.splice(0,1)
        }).catch(() => {
            console.log("one of the requests failed.")
        })
        }, 10000)
      
}
 /*  ==================chart js function   ================== */

function addData(chart, label, newData) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset,index) => {
        dataset.data.push(newData[index]?.USD);
      
    });
    chart.update();
}



/*  ==================set up about page   ================== */
function aboutPage() {
    clearInterval(myInterval)

    const aboutdiv = document.querySelector("#aboutdiv")
 
    aboutdiv.classList.remove("d-none")
   
}


/*  ==================searchcoin  ================== */
 async function searchcoin(data){
    const searchvalue = document.querySelector("#Search").value
    const searchCheckBox= document.querySelector("#checkbox").checked
    
    if (searchCheckBox=== true) {
        const dataToObj = data.reduce((obj, current) => {
            obj[current?.id] = current
            return obj
        }, {})
        
       
       const arrayKey=[]
       if (dataToObj[searchvalue]!= undefined) {
        arrayKey.push(dataToObj[searchvalue])
         draw(arrayKey) 
       }else{
        draw(arrayKey) 
       }
       
    

    } else {
        const coinsFoundSearch = data.filter(current => current?.name.toLowerCase().includes(searchvalue.toLowerCase()))
        
        draw(coinsFoundSearch)
       
    }
   
    
}

/*  ==================fetch function for cards ================== */

async function getCoins() { try {

   const data= await fetch(`https://api.coingecko.com/api/v3/coins/list`) 
 const result= await data.json()
 console.log(result);
return result
    
} catch (error) {alert("failed to fetch crypto data")
    
}
    
}


/*  ==================start the ui for cards ================== */
function draw(data) {
  if (!Array.isArray(data)) return
   
  const coinList = document.querySelector("#coinList")
  coinList.innerHTML=""
;

  const DrawCoinUI =data.map(current =>getSingleCoinUI(current))
   
  let start=0
  let end=200
let arraySlice=DrawCoinUI.slice(start,end)
coinList.append(...arraySlice)  
function scrollDo() {
  if (window.scrollY+window.innerHeight >= document.documentElement.scrollHeight-5) {
     
    start=start+200
    end=end+200
    arraySlice=DrawCoinUI.slice(start,end)
    coinList.append(...arraySlice)  
  }
}


if (scrollHandler) {
  window.removeEventListener("scroll", scrollHandler); 
}

scrollHandler = scrollDo; 
window.addEventListener("scroll", scrollHandler); 

 
}

/*  ==================single card ================== */
function  getSingleCoinUI(coin){

    if (typeof coin !== 'object') return;


const colCard = document.createElement("div")
colCard.className = "col-sm-4"

const cardDiv = document.createElement("div")
cardDiv.className = "card m-2 bg-dark text-white box box2"
cardDiv.style.height="200px"

const cardBody = document.createElement("div")
cardBody.className = "card-body content row"

const topCardDiv = document.createElement("div")
topCardDiv.className=" d-flex justify-content-between"

const cardTitle = document.createElement("h5")
cardTitle.innerText =coin?.name
cardTitle.className="card-title col-10"


const toggleDiv =document.createElement("div")
toggleDiv.className = "form-check form-switch col-1 d-flex justify-content-center"

const toggle =document.createElement("input")
toggle.className ="form-check-input  bg-success "
toggle.setAttribute("type", "checkbox")
toggle.setAttribute("role", "switch")
toggleDiv.append(toggle)

if (coin.ischecked===true)
{toggle.checked=true}
else{toggle.checked=false}
/*  ==================toggle event  ================== ==============================*/
toggle.addEventListener("click", ()=>{
  

  checkedtoggle(coin)})

const placeHolderImg= document.createElement("div")
placeHolderImg.className="col-4 d-flex justify-content-center"
placeHolderImg.innerHTML=""
const para = document.createElement("p")
para.className="card-text col-8 mb-0"
para.innerText=coin?.id

const placeHolderbutton= document.createElement("div")
placeHolderbutton.className="d-flex align-items-center "
const button = document.createElement("button")
button.innerText="more info"
button.className="btn btn-success"

/*  ==================more info event  ================== ==============================*/
button.addEventListener("click", async () => {
  
    try {
         loader.style.visibility = "visible"
         
         loaderkid.setAttribute("aria-valuenow","0")
         loaderkid.style.width="0%"
         if (placeHolderImg.innerHTML==="") {
    await getDataFromCacheOrApi(coin?.id) 
       const result=cache[coin?.id].data;
       console.log(result);
        const imageCoin=document.createElement("img")
   imageCoin.src=result?.image?.large
   imageCoin.style.height="75px"
   if (result?.market_data.current_price?.usd) {
    para.innerText="$= "+result?.market_data.current_price?.usd+"\n €= "+result?.market_data.current_price?.eur+"\n ₪= "+result?.market_data.current_price?.ils
   } else {
    para.innerText="there is no data about this coin price"
   }
   
   cardDiv.className = "card m-2 bg-success  text-white box"
   button.className="btn btn-dark"
   toggleDiv.className ="invisible"
   placeHolderImg.append(imageCoin)
    button.innerText="less info"
    } else {
        placeHolderImg.innerHTML=""
    para.innerText=coin?.name
    cardDiv.className = "card m-2 bg-dark  text-white box box2"
    button.className="btn btn-success"
    button.innerText="more info"
      toggleDiv.className ="visible form-check form-switch col-1 d-flex justify-content-center"

    }
    } catch (error) {
        
    }finally{
        loaderkid.setAttribute("aria-valuenow","100")
        loaderkid.style.width="100%"
         loader.style.visibility = "collapse"
        setTimeout(()=>{
        loaderkid.setAttribute("aria-valuenow","0")
         loaderkid.style.width="0%"
        },1000)
       
    }
   
   
   

})

placeHolderbutton.append(button)
topCardDiv.append(cardTitle,toggleDiv)
cardBody.append(topCardDiv,para,placeHolderImg,placeHolderbutton)
cardDiv.append(cardBody)
colCard.append(cardDiv)


return  colCard
}

/*  ==================fetch more info  ================== ==============================*/
async function getCoinInfoId(id) {
 
    try {
        const result = await fetch("https://api.coingecko.com/api/v3/coins/" + id, {
            method: "GET",
        })
        const data = await result.json()
        return data;
       
        
    } catch (error) {
        alert("failed in fetch")
    }
 
}


/*  ==================cache function ================== ==============================*/
async function getDataFromCacheOrApi(id) {
    const TIMESTAMP_DIFF = 12000;
   
    if (cache[id]) {
        console.log("from cache");
      const data = cache[id];
      const now = new Date().getTime();
      if (new Date(data.timestamp).getTime() + TIMESTAMP_DIFF >= now) {
        return cache[data];
      } else {
        console.log("cache is over new");
        cache[id] = {
          data: await getCoinInfoId(id),
          timestamp: new Date().toISOString(),
        };
      }
    } else {
        console.log("new cache");
      cache[id] = {
        data: await  getCoinInfoId(id),
        timestamp: new Date().toISOString(),
      };
    }
  }




/*  ==================toggle function that set up the off canvas ================== ==============================*/


function checkedtoggle(coin){
   

    if (  event.target.checked) {
      
        if (livePricing.length===5) {
            livePricing.push(coin)
            coin.ischecked=true
            const offcanvasfavorites = document.querySelector("#offcanvasfavorites")
            offcanvasfavorites.innerHTML=""
            const favoriteUi=livePricing.map(current =>offCanvasUi(current))
            offcanvasfavorites.append(...favoriteUi) 
            bsOffcanvas.show()
        }
        else{
            
            
            coin.ischecked=true
            livePricing.push(coin)
            
            
        }
        
    } else {
     
        
        coin.ischecked=false
       
           const foundIndex=livePricing.findIndex((current)=>current.id===coin.id)
           if (foundIndex > -1) {
            livePricing.splice(foundIndex, 1)
        }
      
    }
  
}



function offCanvasUi(favorite) {
    if (typeof favorite !== 'object') return;
    const div = document.createElement("div")
    const cardTitle = document.createElement("h5")
    cardTitle.innerText =favorite?.name
    cardTitle.className="card-title col-10"
    
    
    const toggleDiv =document.createElement("div")
    toggleDiv.className = "form-check form-switch col-1 d-flex justify-content-center"
    
    const toggle =document.createElement("input")
    toggle.className ="form-check-input  bg-success "
    toggle.setAttribute("type", "checkbox")
    toggle.setAttribute("role", "switch")
    toggleDiv.append(toggle)
    
    if (favorite.ischecked===true)
    {toggle.checked=true}
    if (favorite.ischecked===false)
        {toggle.checked=false}
    /*  ==================toggle event  ================== ==============================*/
    toggle.addEventListener("click", ()=>checkedtoggle(favorite))


 div.append(cardTitle,toggleDiv)

 return div

}

  /*  ==================fetch data for live pricing  ================== ==============================*/
async function getCoinliveprice() {
    if (livePricing.length===0) {
        return data=[]
    }
    const stringforapi=livePricing.reduce((string, current) => {
        string=string+current.symbol+","
          return string
      }, "") 
    try {
        const result = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${stringforapi}&tsyms=USD`, {
            method: "GET",
        })
        const data = await result.json()
     
        return data;

    
       
        
    } catch (error) {
        alert("failed to fetch live price")
    }
 
}





init();



