import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "stopover";
const response = "stopovers";
const collectionId = "stopoverId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                stopoverFlight: true,
                stopoverAirport: true
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
        const { stopoverFlightId, stopoverAirportId, stopoverRank, stopoverProjectedArrival, stopoverProjectedDeparture } = await req.json();

        // Valider les données d'entrée
        if (!stopoverFlightId || !stopoverAirportId || !stopoverRank || !stopoverProjectedArrival || !stopoverProjectedDeparture) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si le vol er l'aéroport existent dans la base de données
        const flightExists = await prisma.flight.findUnique({
            where: {
                flightId: stopoverFlightId,
            },
        });
        if (!flightExists) {
            return NextResponse.json(
                { message: 'Flight does not exist.' },
                { status: 404 }
            );
        }

        const airportExists = await prisma.airport.findUnique({
            where: {
                airportId: stopoverAirportId,
            },
        });
        if (!airportExists) {
            return NextResponse.json(
                { message: 'Airport does not exist.' },
                { status: 404 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newStopover = await prisma.stopover.create({
            data: {
                stopoverFlightId,
                stopoverAirportId,
                stopoverRank,
                stopoverProjectedArrival,
                stopoverProjectedDeparture
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newStopover, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create stopover', error },
            { status: 500 }
        );
    }
}
