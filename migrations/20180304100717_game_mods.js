
exports.up = function(knex) {
  return knex.schema.table('game', function(t){
    t.text('pgn');
    t.string('player1');
    t.string('player2');
    t.timestamp('ended_at').nullable();
  })
};

exports.down = function(knex) {
  return knex.schema.table('game', function(t){
    t.dropColumn('pgn');
    t.dropColumn('player1');
    t.dropColumn('player2');
    t.dropColumn('ended_at');
  })

};
