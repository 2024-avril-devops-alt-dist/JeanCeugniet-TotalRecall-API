import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "buyer";
const response = "buyers";
const collectionId = "buyerId"


export const GET = async () => {
    console.log("GET >>")
    try {
        const data = await prisma[collection].findMany();
        console.log('------------buyers : ', data)
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

