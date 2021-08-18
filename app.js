// //Assignment - Movies Website
// In this assigment you are going to allow a user to keep track of their movie collection. Create a website which will allow the user perform the following features:

// Ability to add a movie (title, description, genre, posterURL)

// Ability to view all movies

// Ability to delete a movie

// Ability to filter movies based on the genre

// Ability to go to movie details page

// Expose all your movies by creating a Web API route at /api/movies which should return all the movies in JSON format.

// Routes:

// /movies - View all movies (Show the poster image and the name of the movie on this age)

// /movies/create - POST - Add a new movie

// /movies/delete - POST - Deletes a movie

// /movies/:movieId - Details about the movie (Show poster image, title, genre and description on this page)

// /movies/genre/:genre - Show movies based on genre

// Use Express Router to create movies.js route which will contain all the routes of the movies

// HARDMODE:

// Allow the user to upload image from their computer to your server's folder instead of asking them to put the URL of the image.



const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.json())
app.use(express.urlencoded())



global.movies = []

//everything inside the the public folder is available at the root level
app.use(express.static('public'))

app.get('/movies',(req, res)=>{
    res.render('index', {allMovies: movies})
})

app.post('/movies/create', (req, res)=>{
    const title = req.body.title
    const description = req.body.description
    const genre = req.body.genre
    const posterURL = req.body.posterURL

    global.movie = {movieId: movies.length +1, title: title, description: description, genre: genre, posterURL: posterURL}
    movies.push(movie)

    console.log(movies)

    res.redirect('/movies')
})


app.post('/delete-movie', (req, res)=>{
    const movieId = parseInt(req.body.movieId)
    movies = movies.filter((movie)=>{
        return movie.movieId != movieId
    })

    res.redirect('/movies')
})


app.get("/movies/:movieId", (req, res) => {

    const movieId = req.params.movieId
    let movie = movies.find((movie) => movie.movieId == movieId)
    console.log(movie)
    res.render("details", movie)
})

app.listen(3000, ()=>{
    console.log('Server is running Ms. Shines...')
})

