import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "booking";
const response = "booking";
const collectionId = "bookingId"

export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
                bookingBuyer: true,
                bookingPassenger: true,
                bookingFlight: true
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

