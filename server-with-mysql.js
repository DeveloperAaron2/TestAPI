import { createApp } from './app.js'
import { MovieModel } from './Models/mysql/movie.js'

createApp({ movieModel: MovieModel })
