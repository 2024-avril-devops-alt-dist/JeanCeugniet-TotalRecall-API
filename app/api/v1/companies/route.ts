import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "company";
const response = "companies";
const collectionId = "companyId"

// Get all items
export const GET = async () => {
    console.log("GET >>")
    try {
        const data = await prisma[collection].findMany();
        console.log('------------companies : ', data)
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

// Create new item
export const POST = async (req: NextRequest) => {
    try {
        // Extraire les données du corps de la requête
        const { companyIATACode, companyName } = await req.json();

        // Valider les données d'entrée
        if (!companyIATACode || !companyName) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newCompany = await prisma.company.create({
            data: {
                companyIATACode,
                companyName,
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newCompany, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create company', error },
            { status: 500 }
        );
    }
}
