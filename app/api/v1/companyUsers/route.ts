import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "companyUser";
const response = "companyUsers";
const collectionId = "companyUserId"


export const GET = async () => {
    console.log("GET >>")
    try {
        const data = await prisma[collection].findMany();
        console.log('------------companyUsers : ', data)
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

