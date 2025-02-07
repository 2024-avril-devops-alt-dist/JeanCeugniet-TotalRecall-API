import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "passenger";
const response = "passengers";
const collectionId = "passengerId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include : {
                passengerClient: true,
                passengerNationalCountry: true

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
        const { passengerClientId, passengerNationalCountryId, passengerDisability, passengerSpecifics } = await req.json();

        // Valider les données d'entrée
        if (!passengerClientId || !passengerNationalCountryId) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si le client et le pays existent dans la base de données
        const clientExists = await prisma.client.findUnique({
            where: {
                clientId: passengerClientId,
            },
        });
        if (!clientExists) {
            return NextResponse.json(
                { message: 'Client does not exist.' },
                { status: 404 }
            );
        }

        const countryExists = await prisma.country.findUnique({
            where: {
                countryId: passengerNationalCountryId,
            },
        });
        if (!countryExists) {
            return NextResponse.json(
                { message: 'Country does not exist.' },
                { status: 404 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newPassenger = await prisma.passenger.create({
            data: {
                passengerClientId,
                passengerNationalCountryId,
                passengerDisability,
                passengerSpecifics
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newPassenger, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create passenger', error },
            { status: 500 }
        );
    }
}
