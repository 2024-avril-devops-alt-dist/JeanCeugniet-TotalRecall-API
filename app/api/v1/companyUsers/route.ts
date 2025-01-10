import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "companyUser";
const response = "companyUsers";
const collectionId = "companyUserId"


export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                companyUserCompany: true,
                companyUserUser: true
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

