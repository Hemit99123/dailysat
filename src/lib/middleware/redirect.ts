import { NextRequest, NextResponse } from "next/server";

const redirectTo = (request: NextRequest, pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.redirect(url);
};

export default redirectTo