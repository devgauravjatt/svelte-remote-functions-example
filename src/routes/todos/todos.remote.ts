import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { todosSchema } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const getTodos = query(async () => {
	const todos = await db.select().from(todosSchema).all();
	return todos;
});

export const addTodo = form(async (data) => {
	const text = data.get('text') as string;
	if (!text) {
		return 'Todo text cannot be empty.';
	}

	await db.insert(todosSchema).values({ todo: text, completed: false });

	await getTodos().refresh();
});

export const toggleTodo = command(async (id: string) => {
	const todoId = Number(id);
	const todo = await db.select().from(todosSchema).where(eq(todosSchema.id, todoId)).get();

	if (!todo) throw error(404, 'Todo not found');

	// Simulate a long-running operation
	await new Promise((r) => setTimeout(r, 2000));

	await db
		.update(todosSchema)
		.set({ completed: !todo.completed })
		.where(eq(todosSchema.id, todoId))
		.catch(() => {
			throw error(404, 'Todo not found');
		});
});

export const deleteTodo = form(async (data) => {
	const id = data.get('id') as string;

	const res = await db
		.delete(todosSchema)
		.where(eq(todosSchema.id, Number(id)))
		.returning();
	if (res.length === 0) error(404, 'Todo not found');
});
