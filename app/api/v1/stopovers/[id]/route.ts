import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "stopover";
const response = "stopover";
const collectionId = "stopoverId"

// Récupérer un item
export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
                stopoverAirport: true,
                stopoverFlight: true
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
        const { stopoverFlightId, stopoverAirportId, stopoverRank, stopoverProjectedArrival, stopoverProjectedDeparture, stopoverRealArrival, stopoverRealDeparture } = await req.json();

        // Vérifier si l'item existe dans la base de données
        const existingItem = await prisma[collection].findUnique({
            where: { [collectionId]: id },
        });
        if (!existingItem) {
            return NextResponse.json(
                { message: 'This stopover does not exist' },
                { status: 404 }
            );
        }

        // Valider les données d'entrée
        if (!stopoverFlightId && !stopoverAirportId && !stopoverRank && !stopoverProjectedArrival && !stopoverProjectedDeparture && !stopoverRealArrival && !stopoverRealDeparture) {
            return NextResponse.json(
                { message: 'At least one field is required to update airport' },
                { status: 400 }
            );
        }

        // Créer un objet de mise à jour basé sur les données reçues
        const updateData: any = {};
        updateData.stopoverFlightId = stopoverFlightId || existingItem.stopoverFlightId;
        updateData.stopoverAirportId = stopoverAirportId || existingItem.stopoverAirportId;
        updateData.stopoverRank = stopoverRank || existingItem.stopoverRank;
        updateData.stopoverProjectedArrival = stopoverProjectedArrival || existingItem.stopoverProjectedArrival;
        updateData.stopoverProjectedDeparture = stopoverProjectedDeparture || existingItem.stopoverProjectedDeparture;
        updateData.stopoverRealArrival = stopoverRealArrival || existingItem.stopoverRealArrival;
        updateData.stopoverRealDeparture = stopoverRealDeparture || existingItem.stopoverRealDeparture;

        // Mettre à jour l'item dans la base de données
        const updatedStopover = await prisma[collection].update({
            where: { [collectionId]: id },
            data: updateData,
        });

        // Retourner l'item mis à jour avec un statut 200 (OK)
        return NextResponse.json(updatedStopover, { status: 200 });
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
