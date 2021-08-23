const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const session = require('express-session')
const authenticate = require('./authentication/auth.js')
const pgp = require('pg-promise')()
const connectionString = 'postgres://zegafusk:vTO3n-Vlxp5xuS1QNKA6_ZRGr2MSBKBP@chunee.db.elephantsql.com/zegafusk'
const db = pgp(connectionString)

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.json())
app.use(express.urlencoded())
app.use("/images", express.static('images'))



// global.movies = []
global.users = [{username: 'janellesh08', password: 'hello'}]


//everything inside the the public folder is available at the root level
app.use(express.static('public'))



//middleware for the session
app.use(session({
    secret: 'THISISASECRET',
    saveUninitialized: false,
    resave: true 
}))


//login route
app.get('/login', (req, res)=>{
res.render('login')
})





//login post route
app.post('/login', (req, res)=>{
    const username = req.body.username
    const password = req.body.password
    const persistedUser = users.find(user =>{
        return user.username == username && user.password == password
    })

    if(persistedUser){
        if(req.session){
            req.session.username = persistedUser.username
            res.render('index')
        }else{
            res.render('login', {errorMessage: 'Username or password is incorrect'})
        }
    }else{
        res.render('login', {errorMessage: 'Username or password is incorrect'})
    }
})


//home page route
app.get('/movies', (req, res)=>{
    db.any('SELECT movie_id, title, genre, poster FROM movies')
    .then(movies =>{
        res.render('index', {allMovies: movies})
    })   
})


//add movies route
app.post('/movies/create', (req, res)=>{
    const title = req.body.title
    const description = req.body.description
    const genre = req.body.genre
    const poster = req.body.poster

    db.none('INSERT INTO movies(title, genre, description, poster) VALUES ($1, $2, $3, $4)',[title, genre, description, poster])
.then(()=>{
    res.redirect('/movies')
})

    // global.movie = {movieId: movies.length +1, title: title, description: description, genre: genre, posterURL: posterURL}
    // movies.push(movie)

    // console.log(movies)   
})


//delete movies route
app.post('/delete-movie',(req, res)=>{
    const movie_id = req.body.movie_id
    console.log(movie_id)
    db.none('DELETE FROM movies WHERE movie_id = $1', [movie_id])

    // movies = movies.filter((movie)=>{
    //     return movie.movie_id != movie_id
    // })

    res.redirect('/movies')
})


//movie details route
app.get("/movies/:movie_id", (req, res) => {

    const movie_id = req.params.movie_id

    db.one('SELECT title, genre, description, poster FROM movies WHERE movie_id = $1', [movie_id])
    .then(movie =>{
        res.render('details', {allMovies: movie})
    })  
    // let movie = movies.find((movie) => movie.movie_id == movie_id)
    // console.log(movie)
    // res.render("details", movie)
})


//logout function 
app.get('/logout', (req, res)=>{
    req.session.destroy(error=>{
        res.clearCookie('connect.sid')
        res.redirect('/login')
    })
})


app.listen(3000, ()=>{
    console.log('Server is running Ms. Shines...')
})

