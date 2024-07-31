let searchElement = document.querySelector("#search")
let homepage = document.querySelector("#homepage")
async function renderCards(movie){

    let htmlTORender=''
    let card = `
        <div class="w-full sm:w-1/2 md:w-1/4 text-center mb-8">
          <img
            src="{image}"
            alt="10things"
            class="h-64 w-48 mx-auto"
          />
          <p id="title" class="mt-4 text-sm font-semibold">{title}</p>
          <p id="description" class="mt-1 text-xs font-normal">
           
           Description
          </p>
          <div class="flex items-center justify-center mt-4">
            <a href="/review?id={imbdID}"
              id = "reviewBttn" class="px-3 py-1.5 text-sm text-white bg-black rounded-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
            >
              Review
            </a>
            <div class="flex items-center ml-4">
              <p>(16)</p>
              <span class="text-yellow-500 text-lg">&#9733;</span>
              <span class="text-yellow-500 text-lg">&#9733;</span>
              <span class="text-yellow-500 text-lg">&#9733;</span>
              <span class="text-yellow-500 text-lg">&#9733;</span>
              <span class="text-gray-400 text-lg">&#9733;</span>
            </div>
          </div>
        </div>
    `;

    let movies = await getMovies(movie)
    console.log(movies)

    if(movies.Error){
        showProgress(false)
        homepage.innerHTML = `<p class="text-center p-4">No movie found</p>`
        return
    }

    movies.Search.forEach((movie)=>{
        const title =  movie.Title
        const id =  movie.imdbID
        const poster = movie.Poster =="N/A" ? "/images/friends.jpg" :  movie.Poster 
        htmlTORender+= card.replace("{title}",title).replace("{image}",poster).replace("{imbdID}",id)

    })

    showProgress(false)
    homepage.innerHTML=htmlTORender

}

async function getMovies(search) {
    let apikey = "7d6c7825"
    let movies =[]
    let url = `http://www.omdbapi.com/?apikey=${apikey}&s=${search}`

    movies= await fetch(url,{
        method : "get"
    })
    .then(async (res)=>{
        return await res.json()
    })

    return movies

}


function clickedSearch(){

    let searchValue = searchElement.value
    renderCards(searchValue)
}


searchElement.addEventListener("keyup",function(){
    let value = searchElement.value
    if(value.length >3){
        showProgress(true)
        renderCards(value)
    }
})


function showProgress(show){
    let progressBar = `<div class="w-screen flex justify-center">
          <img src="images/loading.gif" alt="" srcset="" />
        </div>`
    if (show){
        homepage.innerHTML=progressBar
    }else{
        homepage.innerHTML=""
    }
}



showProgress(true)
renderCards("westerns")

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("reviewBttn").onclick = function() {
        window.location.href = "reviewpage.html";
    };
});
