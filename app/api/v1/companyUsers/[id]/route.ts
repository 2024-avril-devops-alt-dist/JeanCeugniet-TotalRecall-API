import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "companyUser";
const response = "companyUser";
const collectionId = "companyUserId"

export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
                companyUserCompany: true,
                companyUserUser: true,
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

