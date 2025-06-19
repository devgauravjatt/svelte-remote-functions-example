<script lang="ts">
	import { addTodo, deleteTodo, getTodos, toggleTodo } from './todos.remote';

	// this behaves like a regular function but uses RPC
	const todos = getTodos();
</script>

<main class="mx-auto max-w-xl space-y-6 p-4">
	<h1 class="text-center text-3xl font-bold">Todo App</h1>

	<form
		class="flex gap-2"
		{...addTodo.enhance(async ({ form, submit, data }) => {
			const text = data.get('text')!.toString().trim();
			const release = await todos.override((todos) => {
				return [...todos, { id: '0', text, done: false }];
			});

			try {
				await submit();
			} finally {
				release();
				form.reset();
			}
		})}
	>
		<input
			type="text"
			name="text"
			placeholder="Add todo"
			autocomplete="off"
			class="flex-1 rounded border px-3 py-2 focus:border-blue-400 focus:ring focus:outline-none"
		/>
		<button
			type="submit"
			class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
		>
			Add
		</button>
		{#if addTodo.error}
			<p class="mt-1 text-sm text-red-500">{addTodo.error.message}</p>
		{/if}
	</form>

	<ul class="space-y-2">
		{#each await todos as todo}
			{@const remove = deleteTodo.for(todo.id)}

			<li class="flex items-center justify-between rounded bg-white p-3 shadow">
				<label class="flex flex-1 items-center gap-2">
					<input
						type="checkbox"
						class="form-checkbox h-5 w-5 text-blue-600"
						checked={todo.done}
						onchange={async () => {
							const release = await todos.override((todos) => {
								return todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t));
							});

							try {
								await toggleTodo(todo.id);
								await todos.refresh();
							} finally {
								release();
							}
						}}
					/>
					<span class="text-lg" class:line-through={todo.done}>{todo.text}</span>
				</label>

				<form
					class="ml-4"
					{...remove.enhance(async ({ submit }) => {
						const release = await todos.override((todos) => {
							return todos.filter((t) => t.id !== todo.id);
						});

						try {
							await submit();
						} catch {
							// Show inline error
						} finally {
							release();
						}
					})}
				>
					{#if remove.error}
						<span class="text-sm text-red-500">{remove.error.message}</span>
					{/if}
					<button
						name="id"
						value={todo.id}
						class="rounded bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
					>
						Delete
					</button>
				</form>
			</li>
		{/each}
	</ul>
</main>
