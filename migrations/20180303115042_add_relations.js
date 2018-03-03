
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('position', function(t){
      t.integer('piece_id').unsigned().references('id').inTable('piece');
    }),
    knex.schema.table('piece', function(t){
      t.integer('game_id').unsigned().references('id').inTable('game');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('position', function(t){
      t.dropForeign('piece_id', 'position_piece_id_foreign');
      t.dropColumn('piece_id')
    }),
    knex.schema.table('piece', function(t){
      t.dropForeign('game_id', 'piece_game_id_foreign');
      t.dropColumn('game_id')
    })
  ])
};
