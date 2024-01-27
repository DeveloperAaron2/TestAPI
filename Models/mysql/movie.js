import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '15253545',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const [genres] = await connection.query(`
      SELECT id FROM genre WHERE LOWER(name)  = ?`, [lowerCaseGenre])
      if (genres.length === 0) return []
      const [{ id }] = genres
      const [moviesgenre] = await connection.query(
        'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie INNER JOIN movie_genre ON movie.id = movie_genre.movie_id WHERE movie_genre.genre_id = ?', id
      )
      return moviesgenre
    }
    const [movies] = await connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM moviesdb.movie;')
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(`
    SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
    FROM movie WHERE id = UUID_TO_BIN(?);`,
    [id]
    )
    return movies
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) 
        VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (e) {
      throw new Error('Error creating movie')
    }
    const [movies] = await connection.query(
      `SELECT title, year, director, duration, rate, poster
      FROM movie WHERE id = UUID_TO_BIN(?)`,
      [uuid]
    )
    return movies[0]
  }

  static async delete ({ id }) {
    // ejercicio
    const [movieDeleted] = await connection.query('SELECT * FROM movie WHERE id = UUID_TO_BIN(?)', [id])
    try {
      await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?)', [id])
    } catch (e) {
      throw new Error(`Error deleting movie + ${id}`)
    }
    return movieDeleted[0]
  }

  static async update ({ id, input }) {
    // ejercicio
    try {
      const [movie] = await connection.query('SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id WHERE id = ?', id)
      const movieUpdated = {
        ...[movie[0]],
        ...input
      }
      const {
        genre: genreInput,
        title,
        year,
        duration,
        director,
        rate,
        poster
      } = movieUpdated
      await connection.query(
        'UPDATE movie SET title = ?, year = ?, duration = ?, director = ?, rate = ?, poster = ? WHERE id = ?',
        [title, year, duration, director, rate, poster, id]
      )
    } catch (e) {
      throw new Error(`Error Updating movie ${id}`)
    }
  }
}
