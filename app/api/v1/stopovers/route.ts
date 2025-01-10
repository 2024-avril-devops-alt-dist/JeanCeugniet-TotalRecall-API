import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "stopover";
const response = "stopovers";
const collectionId = "stopoverId"


export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                stopoverFlight: true,
                stopoverAirport: true
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
}

