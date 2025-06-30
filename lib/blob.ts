import { put, get, del, list } from "@vercel/blob";

const BUCKET = process.env.VERCEL_BLOB_BUCKET!;

// key format:  {accId}/{templateName}.json
export const tplKey = (acc: string, name: string) => `${acc}/${name}.json`;

/* SAVE */
export async function saveTpl(acc: string, name: string, json: unknown) {
  await put(tplKey(acc, name), JSON.stringify(json), {
    bucket: BUCKET,
    access: "private",          // or "public" if you want a URL
    allowOverwrite: true,
    cacheControlMaxAge: 60,     // minute-level cache; fine for templates
  });
}

/* LOAD (null if missing) */
export async function loadTpl(acc: string, name: string) {
  const res = await get(tplKey(acc, name), { bucket: BUCKET });
  if (!res) return null;
  return JSON.parse(await res.text());
}

/* LIST names (no .json suffix) */
export async function listTpls(acc: string) {
  const { blobs } = await list({ bucket: BUCKET, prefix: `${acc}/` });
  return blobs.map((b) => b.pathname.split("/")[1].replace(/\\.json$/, ""));
}

/* DELETE */
export const deleteTpl = (acc: string, name: string) =>
  del(tplKey(acc, name), { bucket: BUCKET });
