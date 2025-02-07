import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "buyer";
const response = "buyers";
const collectionId = "buyerId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                buyerClient: true
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
        const { buyerClientId } = await req.json();

        // Valider les données d'entrée
        if (!buyerClientId) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si le client existe dans la base de données
        const clientExists = await prisma.client.findUnique({
            where: {
                clientId: buyerClientId,
            },
        });
        if (!clientExists) {
            return NextResponse.json(
                { message: 'Client does not exist.' },
                { status: 404 }
            );
        }

        // Créer un nouvel acheteur dans la base de données avec Prisma
        const newBuyer = await prisma.buyer.create({
            data: {
                buyerClientId,
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newBuyer, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create buyer', error },
            { status: 500 }
        );
    }
}
