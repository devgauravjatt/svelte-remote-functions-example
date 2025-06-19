# ⚡ SvelteKit Remote Functions Showcase

Welcome to a demo of the new **Remote Functions** in [SvelteKit](https://github.com/sveltejs/kit/discussions/13897)! This feature is currently experimental 🧪 and provides a powerful way to colocate server logic directly with components using `.remote.ts` files.

> [!WARNING]
> Remote Functions are currently in experimental and not yet officially released in a stable version.

---

## 🧪 What Are Remote Functions?

Remote Functions let you write server-only logic in `.remote.ts` files and call them from your Svelte components as if they were regular functions. Depending on whether you're on the client or server, they either execute directly or automatically wrap a `fetch()` request behind the scenes.

✨ **Highlights:**

- 🔐 Safe & secure server-only code (e.g., DB access, secrets)
- 📦 Fully type-safe and colocated logic
- 💨 Automatically serialized via `devalue`
- 🔄 Reactive and cached query results
- 🧩 Supports `query`, `form`, `command`, and `prerender`

---

## 📂 Examples

Explore the source code examples:

- ✅ [Todos Example (Full CRUD)](https://github.com/devgauravjatt/svelte-remote-functions-example/tree/main/src/routes/todos)
- 🧱 [Simple Todos (Inspired by Joy of Code)](https://github.com/devgauravjatt/svelte-remote-functions-example/tree/main/src/routes/todos-simple)

---

## 🔗 Official Resources

- 📚 [Remote Functions Official Discussion #13897](https://github.com/sveltejs/kit/discussions/13897)
- 🎥 [Joy of Code's Remote Function Example Repo](https://github.com/mattcroat/svelte-rpc-example)

---

## 🧑‍💻 Try It Yourself

To enable Remote Functions in your project:

```ts
// svelte.config.js
const config = {
	kit: {
		experimental: {
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};
```

Then create a `.remote.ts` file and use `query`, `form`, or `command` from `$app/server`.

Example:

```ts
// data.remote.ts
import { query, form } from '$app/server';
import * as db from '$lib/server/db';

export const getLikes = query(async (id: string) => {
	const [row] = await db.sql`SELECT likes FROM item WHERE id = ${id}`;
	return row.likes;
});

export const addLike = form(async (data: FormData) => {
	const id = data.get('id');
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
	return { success: true };
});
```

---

## 📣 Contributions Welcome!

Got ideas, examples, or improvements? Open a PR or issue — let’s build this together! 🚀

---

## 📜 License

MIT © [devgauravjatt](https://github.com/devgauravjatt) and [Joy of Code](https://github.com/mattcroat)
