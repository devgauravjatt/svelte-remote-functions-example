<script lang="ts">
	import { addTodo, deleteTodo, getTodos, toggleTodo } from './todos.remote';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let todos = $state(data.todos);

	async function refreshData() {
		todos = (await getTodos()).reverse();
	}

	async function toggle_todo(id: string) {
		try {
			await toggleTodo(id);
			refreshData();
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="mx-auto my-12 max-w-3xl px-6">
	<h1 class="mb-6 text-4xl font-bold text-gray-800">Todos</h1>

	<!-- using enhance to customize how the form is progressively enhanced -->
	<form
		{...addTodo.enhance(async ({ form, submit, data }) => {
			const text = data.get('text')!.toString().trim();
			try {
				await submit();
				refreshData();
			} finally {
				form.reset();
			}
		})}
		class="mx-auto mt-6 flex w-full max-w-md flex-col items-stretch gap-2 rounded-2xl bg-white p-4 shadow-md sm:flex-row"
	>
		<input
			type="text"
			name="text"
			placeholder="Add todo"
			autocomplete="off"
			class="flex-1 rounded-xl border border-gray-300 px-4 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
		/>

		<button
			type="submit"
			class="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all hover:bg-blue-700"
		>
			Add
		</button>

		{#if addTodo.error}
			<p class="mt-2 text-sm text-red-600 sm:col-span-2">{addTodo.error.message}</p>
		{/if}
	</form>

	<ul class="space-y-4">
		{#each todos as todo (todo.id)}
			{@const remove = deleteTodo.for(todo.id)}
			<li
				class="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
			>
				<div class="flex items-center space-x-4">
					<input
						onchange={() => toggle_todo(String(todo.id))}
						type="checkbox"
						bind:checked={todo.completed}
						class="h-5 w-5 accent-green-600"
					/>
					<span class="{todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'} text-lg">
						{todo.todo}
					</span>
				</div>

				<form
					{...remove.enhance(async ({ submit }) => {
						try {
							// submit form
							await submit();
							refreshData();
						} catch (error) {
							console.log('🚀 {...remove.enhance error :- ', error);
							// we catch the error to show the error inline instead of the nearest error page
						}
					})}
				>
					<input hidden type="text" name="id" value={todo.id} class="hidden" />
					<!-- this seems to have bugs 🐛  -->
					{#if remove.error}
						<span class="error">{remove.error.message}</span>
					{/if}
					<button
						class="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
					>
						Delete
					</button>
				</form>
			</li>
		{/each}
	</ul>
</div>
