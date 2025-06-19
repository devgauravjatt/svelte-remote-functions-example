import { db } from '$lib/server/db';
import { todosSchema } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const todos = (await db.select().from(todosSchema).all()).reverse();
	return {
		todos
	};
}) satisfies PageServerLoad;
