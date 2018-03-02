module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      port: 3306,
      user : process.env.DB_USERNAME_CM,
      password : process.env.DB_PASSWORD_CM,
      database : 'chessboard'
    }
  },
};