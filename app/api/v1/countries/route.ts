import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "country";
const response = "countries";
const collectionId = "countryId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                countryCities: true
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

// Create new item
export const POST = async (req: NextRequest) => {
    try {
        // Extraire les données du corps de la requête
        const { countryName } = await req.json();

        // Valider les données d'entrée
        if (!countryName) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newCountry = await prisma.country.create({
            data: {
                countryName,
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newCountry, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create country', error },
            { status: 500 }
        );
    }
}
