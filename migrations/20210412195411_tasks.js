
exports.up = function (knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('id');
        table.string('title');
        table.text('description');
        table.boolean('isChecked');
        table.integer('projectId');
        table.foreign('projectId').references('projects.id');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tasks');
};

