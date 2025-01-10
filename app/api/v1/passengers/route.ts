import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "passenger";
const response = "passengers";
const collectionId = "passengerId"


export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include : {
                passengerClient: true,
                passengerNationalCountry: true

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

