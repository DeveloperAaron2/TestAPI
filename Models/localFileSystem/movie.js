import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto'
const movies = readJSON('../movies.json')

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const filterMovies = movies.filter(
        movie => movie.genre.some(g => g.toLowerCase === genre.toLowerCase)
      )
      return filterMovies
    }
    return movies
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    movies.push(newMovie)
    return newMovie
  }

  static async delete ({ id }) {
    const movieindex = movies.findIndex(movie => movie.id === id)
    if (movieindex === -1) return false

    movies.splice(movieindex, 1)
    return true
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }
    return movies[movieIndex]
  }
}
