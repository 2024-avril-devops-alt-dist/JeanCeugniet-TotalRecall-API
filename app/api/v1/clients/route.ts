import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "client";
const response = "clients";
const collectionId = "clientId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                clientUser: true
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
        const { clientUserId, clientFirstname, clientLastname, clientAddress, clientCityId } = await req.json();

        // Valider les données d'entrée
        if (!clientUserId || !clientFirstname || !clientLastname || !clientAddress || !clientCityId) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si le user et la ville existe dans la base de données
        const userExists = await prisma.user.findUnique({
            where: {
                userId: clientUserId,
            },
        });
        if (!userExists) {
            return NextResponse.json(
                { message: 'User does not exist.' },
                { status: 404 }
            );
        }

        const cityExists = await prisma.city.findUnique({
            where: {
                cityId: clientCityId,
            },
        });
        if (!userExists) {
            return NextResponse.json(
                { message: 'City does not exist.' },
                { status: 404 }
            );
        }

        // Créer un nouveau client dans la base de données avec Prisma
        const newClient = await prisma.client.create({
            data: {
                clientUserId, 
                clientFirstname, 
                clientLastname, 
                clientAddress, 
                clientCityId
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newClient, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create client', error },
            { status: 500 }
        );
    }
}
