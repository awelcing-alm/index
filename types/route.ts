// types/route.ts
import type { NextRequest } from "next/server";

/** Next can pass the context as a Promise during type generation. */
export type RouteCtx<K extends string = never> =
  | { params: { [P in K]: string } }
  | Promise<{ params: { [P in K]: string } }>;

export const getParams = async <K extends string>(ctx: RouteCtx<K>) =>
  (await ctx).params;

export type RouteHandler<K extends string> = (
  req: NextRequest,
  ctx: RouteCtx<K>
) => Promise<Response> | Response;