import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "city";
const response = "cities";
const collectionId = "cityId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                cityCountry: true
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
        const { cityName, cityCountryId } = await req.json();

        // Valider les données d'entrée
        if (!cityName || !cityCountryId) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si le pays existe dans la base de données
        const countryExists = await prisma.country.findUnique({
            where: {
                countryId: cityCountryId,
            },
        });
        if (!countryExists) {
            return NextResponse.json(
                { message: 'Country does not exist.' },
                { status: 404 }
            );
        }

        // Créer une nouvelle ville dans la base de données avec Prisma
        const newCity = await prisma.city.create({
            data: {
                cityName,
                cityCountryId,
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newCity, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create city', error },
            { status: 500 }
        );
    }
}
