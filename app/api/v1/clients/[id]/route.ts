import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "client";
const response = "client";
const collectionId = "clientId"

export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
                clientUser: true,
                clientCity: true,
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

