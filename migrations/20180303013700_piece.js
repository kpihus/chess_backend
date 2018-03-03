
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('piece', function(t){
    t.increments();
    // t.integer('game_id').unsigned().references('id').inTable('game');
    t.string('name'); //name in pgn notation (Q == queen, K==king, null==pawn etc)
    t.boolean('is_white');
    t.timestamp('created_at').defaultTo(knex.fn.now());

  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('piece')
};
