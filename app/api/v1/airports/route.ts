import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "airport";
const response = "airports";
const collectionId = "airportId"


export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                airportCity: true
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

export const POST = async (req: NextRequest) => {
    try {
        // Extraire les données du corps de la requête
        const { airportIATACode, airportCityId, airportName } = await req.json();

        // Valider les données d'entrée
        if (!airportIATACode || !airportCityId || !airportName) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si la ville existe dans la base de données
        const cityExists = await prisma.city.findUnique({
            where: {
                cityId: airportCityId,
            },
        });

        if (!cityExists) {
            return NextResponse.json(
                { message: 'City does not exist.' },
                { status: 404 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newAirport = await prisma.airport.create({
            data: {
                airportIATACode,
                airportCityId,
                airportName,
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newAirport, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create airport', error },
            { status: 500 }
        );
    }
}

// Route pour supprimer un aéroport
export const DELETE = async (req: NextRequest ) => {
    try {
        const { airportId } = await req.json();
        console.log(`airportId : ${airportId}`);

        // Vérifier si l'aéroport existe dans la base de données
        const airportExists = await prisma.airport.findUnique({
            where: {
                airportId,
            },
        });
        console.log(`airportExists : ${airportExists}`);

        if (!airportExists) {
            return NextResponse.json(
                { message: 'This airport does not exist' },
                { status: 404 }
            );
        }

        // Supprimer l'aéroport de la base de données
        await prisma.airport.delete({
            where: {
                airportId,
            },
        });

        // Retourner une réponse avec un statut 204 (No Content)
        return NextResponse.json(
            { status: 204 }
        );

    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Cound not delete the airport', error },
            { status: 500 }
        );
    }

}
