import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';


const filePath = path.join(process.cwd(), 'data', 'approvals.json');
let memory: Record<string, string[]> | null = null;


async function readApprovals() {
try {
const txt = await fs.readFile(filePath, 'utf8');
return JSON.parse(txt) as Record<string, string[]>;
} catch {
return memory ?? {};
}
}


async function writeApprovals(data: Record<string, string[]>) {
try {
await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
} catch {
console.warn('[approvals] Falling back to in-memory store (FS not writable).');
memory = data;
}
}


export async function GET(req: Request) {
const url = new URL(req.url);
const listingId = url.searchParams.get('listingId');
const data = await readApprovals();
if (listingId) {
return NextResponse.json({ status: 'success', result: data[listingId] || [] });
}
return NextResponse.json({ status: 'success', result: data });
}


export async function POST(req: Request) {
const body = (await req.json()) as { listingId: string; reviewIds: string[] };
if (!body?.listingId || !Array.isArray(body.reviewIds)) {
return NextResponse.json({ status: 'error', message: 'listingId and reviewIds[] required' }, { status: 400 });
}
const data = await readApprovals();
data[body.listingId] = Array.from(new Set(body.reviewIds));
await writeApprovals(data);
return NextResponse.json({ status: 'success', result: data[body.listingId] });
}
