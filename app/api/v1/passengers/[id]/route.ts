import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "passenger";
const response = "passenger";
const collectionId = "passengerId"

export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
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

