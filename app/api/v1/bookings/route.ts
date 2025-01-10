import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "booking";
const response = "bookings";
const collectionId = "bookingId"


export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
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

