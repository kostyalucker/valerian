import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { getToken } from "next-auth/jwt";

const requireAuth: string[] = ["/customers"];

export function withRedirectByRole(next: NextMiddleware) {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = await next(request, _next);
    const pathname = request.nextUrl.pathname;

    if (res) {
      // if (requireAuth.some((path) => pathname.startsWith(path))) {
      //   const token = await getToken({
      //     req: request,
      //     secret: process.env.NEXTAUTH_SECRET,
      //   });

      //   //check not logged in
      //   if (!token) {
      //     const url = new URL(`/`, request.url);
      //     url.searchParams.set("callbackUrl", encodeURI(request.url));

      //     return NextResponse.redirect(url);
      //   }

      //   //check if not authorized
      //   // if (token.role !== "SUPERADMIN") {
      //   //   const url = new URL(`/dashboard`, request.url);
      //   //   return NextResponse.rewrite(url);
      //   // }
      // }

      return res;
    }
  };
}
