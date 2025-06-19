import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const todosSchema = sqliteTable('todos', {
	id: integer('id').primaryKey(),
	todo: text('todo').notNull(),
	completed: integer('completed', { mode: 'boolean' }).notNull()
});
