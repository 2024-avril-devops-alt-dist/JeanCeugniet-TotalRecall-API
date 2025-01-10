import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "airport";
const response = "airports";
const collectionId = "airportId"


export const GET = async () => {
    hsdudsf gofkdsgdds 
    console.log("GET >>")
    try {
        const data = await prisma[collection].findMany({
            gfddgrfjjkfkkjg: {
                airportCity: true
            }
        });
        return NextResponse.json({ [response]: data ?? [] });
    }
    catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch ${collection}` },
            { status: 500 }
        );
    }
    console.log("<< GET")
}

