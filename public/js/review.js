
async function GetMovieByID(id){
    let apikey = "7d6c7825"
    let movie ={}
    let url = `http://www.omdbapi.com/?apikey=${apikey}&i=${id}`

    movie= await fetch(url,{
        method : "get"
    })
    .then(async (res)=>{
        return await res.json()
    })

    return movie
}



function showProgress(show){
    let progress = document.querySelector(".progress")
    let displayReview = document.querySelector("#displayReview")
    let progressBar = `<div class="w-screen flex justify-center">
          <img src="images/loading.gif" alt="" srcset="" />
        </div>`
    if (show){
        displayReview.classList.add("hidden")
        progress.innerHTML=progressBar
    }else{
        displayReview.classList.remove("hidden")
        progress.innerHTML=""
    }
}

async function submitReview(event){
    
    event.preventDefault(); // Prevent the default form submission

    let form =  document.querySelector("#reviewform")
    let textarea = document.querySelector("#review")
    let review = textarea.value

    const res = await fetch("review", {
        method:"post", // Use the form's method (GET/POST)
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ review,username:"paul" }) // Send the review data
    })
    .then(response=>response.json())

    if (res.message){
        alert("Review has been saved")
    }else{
        alert(res.error)
    }

    textarea.value=""   
}


async function load(){
    showProgress(true)
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    let movie = await GetMovieByID(myParam)
    showProgress(false)
    let movieTitle = document.querySelector("#movieTitle")
    let moviePoster = document.querySelector("#moviePoster")
    let moviePlot = document.querySelector("#moviePlot")
    let movieDirector = document.querySelector("#movieDirector")
    let movieWriter = document.querySelector("#movieWriter")
    let movieRuntime = document.querySelector("#movieRuntime")
    let movieActor = document.querySelector("#movieActor")


    movieTitle.innerHTML = movie.Title
    moviePoster.setAttribute("src",movie.Poster)
    moviePlot.innerHTML = movie.Plot
    movieDirector.innerHTML =`Directors: ${movie.Director}` 
    movieWriter.innerHTML = `Writers: ${movie.Writer}` 
    movieRuntime.innerHTML =  `Runtime: ${movie.Runtime}` 
    movieActor.innerHTML= `Actors: ${movie.Actors}` 

}

load()