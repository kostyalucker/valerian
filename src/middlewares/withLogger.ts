import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextMiddleware, NextRequest } from "next/server";

export function withLogger(next: NextMiddleware) {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = await next(request, _next);

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log(token);

    return res;
  };
}
