import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "flight";
const response = "flight";
const collectionId = "flightId"

// Récupérer un item
export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
                flightCompany: true,
                flightStopovers: true
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
        const { flightCompanyId, flightIATACode, flightDepartureAirportId, flightArrivalAirportId, flightProjectedDeparture, flightProjectedArrival, flightRealDeparture, flightRealArrival, flightCanBeBooked } = await req.json();

        // Vérifier si l'item existe dans la base de données
        const existingItem = await prisma[collection].findUnique({
            where: { [collectionId]: id },
        });
        if (!existingItem) {
            return NextResponse.json(
                { message: 'This flight does not exist' },
                { status: 404 }
            );
        }

        // Valider les données d'entrée
        if (!flightCompanyId && !flightIATACode && !flightDepartureAirportId && !flightArrivalAirportId && !flightProjectedDeparture && !flightProjectedArrival && !flightRealDeparture && !flightRealArrival && !flightCanBeBooked) {
            return NextResponse.json(
                { message: 'At least one field is required to update flight' },
                { status: 400 }
            );
        }

        // Créer un objet de mise à jour basé sur les données reçues
        const updateData: any = {};
        updateData.flightCompanyId = flightCompanyId || existingItem.flightCompanyId;
        updateData.flightIATACode = flightIATACode || existingItem.flightIATACode;
        updateData.flightDepartureAirportId = flightDepartureAirportId || existingItem.flightDepartureAirportId;
        updateData.flightArrivalAirportId = flightArrivalAirportId || existingItem.flightArrivalAirportId;
        updateData.flightProjectedDeparture = flightProjectedDeparture || existingItem.flightProjectedDeparture;
        updateData.flightProjectedArrival = flightProjectedArrival || existingItem.flightProjectedArrival;
        updateData.flightRealDeparture = flightRealDeparture || existingItem.flightRealDeparture;
        updateData.flightRealArrival = flightRealArrival || existingItem.flightRealArrival;
        updateData.flightCanBeBooked = flightRealArrival || existingItem.flightCanBeBooked;

        // Mettre à jour l'item dans la base de données
        const updatedFlight = await prisma[collection].update({
            where: { [collectionId]: id },
            data: updateData,
        });

        // Retourner l'item mis à jour avec un statut 200 (OK)
        return NextResponse.json(updatedFlight, { status: 200 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Cound not update the flight', error },
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
