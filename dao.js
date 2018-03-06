const knexConf = require('./knexfile').development;
const knex = require('knex')(knexConf);

const storeGame = async (player) => {
  const result = await knex('game').insert({
    player_name: player
  });
  if (result.length) {
    return {game_id: result[0]}
  }
  return {game_id: null}
};

const storeSetOfPieces = (game_id) => {
  let set = 'RNBQKBNR/PPPPPPPP/00000000/00000000/00000000/00000000/pppppppp/rnbqkbnr';
  const col = 'abcdefgh';

  set = set.split('/');
  let id = 0;
  let rowId = 0;
  let colId = 0;
  const tasks = [];

  set.forEach(rowString => {
    rowId++;
    rowString.split('').forEach(piece => {
      colId++;
      id++;

      (function (id) {
        const pgn = `${col[colId - 1]}${rowId}`;
        console.log('p', piece, id) // TODO: REMOVE
        if (piece !== '0') {
          tasks.push(
            knex('piece').insert({
              name: piece,
              is_white: piece.toLowerCase() === piece ? false : true,
              game_id
            })
              .then(res => {
                console.log(res);
                return knex('position').insert({
                  to_pgn: pgn,
                  to_id: id,
                  piece_id: res[0]
                })
              })
          );
        }
      })(id)
    });
    colId = 0;
  });
  return Promise.all(tasks);
};

const findPieceOnPos = async (pos) => {
  const piece = await knex('position').select('*')
    .leftJoin('piece', 'position.piece_id', 'piece.id')
    .where('to_id', '=', pos)

  return piece;
};

const startNewGame = async (players) => {
  const {player1, player2} = players;
  //Set last ended
  await knex('game')
    .where('ended_at', null)
    .update({
      ended_at: new Date()
    });
  await knex('game')
    .insert({
      player1, player2
    })
};

const updatePgn = async(pgn)=>{
  await knex('game')
    .where('ended_at', null)
    .update({pgn})
};

const getHistory = async() => {
  return await knex('game').select('*')
};


module.exports = {
  storeGame,
  storeSetOfPieces,
  findPieceOnPos,
  startNewGame,
  updatePgn,
  getHistory
};