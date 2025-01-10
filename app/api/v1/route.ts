import { NextResponse } from "next/server"

export const GET = async () => {
    return new NextResponse("I'm the default route for API access")
}

