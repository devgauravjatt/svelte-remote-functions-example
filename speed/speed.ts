import 'dotenv/config';
import todos from './data';
import { todosSchema } from '../src/lib/server/db/schema';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({ url: 'file:local.db' });

const db = drizzle(client);

const res = await db.insert(todosSchema).values(todos);

console.log('🚀 res :- ', res);
