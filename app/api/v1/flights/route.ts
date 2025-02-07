import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "flight";
const response = "flights";
const collectionId = "flightId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                flightCompany: true
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
        const { flightCompanyId, flightIATACode, flightDepartureAirportId, flightArrivalAirportId, flightProjectedDeparture, flightProjectedArrival } = await req.json();

        // Valider les données d'entrée
        if (!flightCompanyId || !flightIATACode || !flightDepartureAirportId || !flightArrivalAirportId || !flightProjectedDeparture || !flightProjectedArrival) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si la companie et l'aéroport existent dans la base de données
        const companyExists = await prisma.company.findUnique({
            where: {
                companyId: flightCompanyId,
            },
        });
        if (!companyExists) {
            return NextResponse.json(
                { message: 'Company does not exist.' },
                { status: 404 }
            );
        }

        const departureAirportExists = await prisma.airport.findUnique({
            where: {
                airportId: flightDepartureAirportId,
            },
        });
        if (!departureAirportExists) {
            return NextResponse.json(
                { message: 'Departure airport does not exist.' },
                { status: 404 }
            );
        }

        const arrivalAirportExists = await prisma.airport.findUnique({
            where: {
                airportId: flightArrivalAirportId,
            },
        });
        if (!arrivalAirportExists) {
            return NextResponse.json(
                { message: 'Arrival airport does not exist.' },
                { status: 404 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newFlight = await prisma.flight.create({
            data: {
                flightCompanyId, 
                flightIATACode, 
                flightDepartureAirportId, 
                flightArrivalAirportId, 
                flightProjectedDeparture, 
                flightProjectedArrival
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newFlight, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create flight', error },
            { status: 500 }
        );
    }
}
