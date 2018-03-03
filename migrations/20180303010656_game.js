
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('game', function(t){
    t.increments();
    t.string('player_name');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('game');
};
