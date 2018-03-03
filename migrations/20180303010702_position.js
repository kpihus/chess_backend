
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('position', function(t){
    t.increments();
    // t.integer('piece_id').unsigned().references('id').inTable('piece');
    t.integer('from_id'); //Position in id number (A1 == 0, B1==1, ... , A2 == 8, etc)
    t.integer('to_id'); //Position in id number (A1 == 0, B1==1, ... , A2 == 8, etc)
    t.string('from_pgn'); //Position in pgn notation
    t.string('to_pgn'); //Position in pgn notation
    t.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('position');
};
