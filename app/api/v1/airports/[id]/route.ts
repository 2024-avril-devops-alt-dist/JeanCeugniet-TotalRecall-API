import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "airport";
const response = "airport";
const collectionId = "airportId"

// Récupérer un item
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
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

// Mettre à jour un item
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    try {
        // Lire les données envoyées dans le corps de la requête
        const { airportIATACode, airportCityId, airportName } = await req.json();

        // Vérifier si l'item existe dans la base de données
        const itemExists = await prisma[collection].findUnique({
            where: { [collectionId]: id },
        });
        if (!itemExists) {
            return NextResponse.json(
                { message: 'This airport does not exist' },
                { status: 404 }
            );
        }

        // Valider les données d'entrée
        if (!airportIATACode && !airportCityId && !airportName) {
            return NextResponse.json(
                { message: 'At least one field is required to update airport' },
                { status: 400 }
            );
        }

        // Créer un objet de mise à jour basé sur les données reçues
        const updateData: any = {};
        if (airportIATACode) updateData.airportIATACode = airportIATACode;
        if (airportCityId) updateData.airportCityId = airportCityId;
        if (airportName) updateData.airportName = airportName;

        // Mettre à jour l'item dans la base de données
        const updatedAirport = await prisma[collection].update({
            where: { [collectionId]: id },
            data: updateData,
        });

        // Retourner l'item mis à jour avec un statut 200 (OK)
        return NextResponse.json(updatedAirport, { status: 200 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Cound not update the airport', error },
            { status: 500 }
        );
    }
}

// Supprimer un item
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;
    try {
        const data = await prisma[collection].delete({
            where: { [collectionId]: id },
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
