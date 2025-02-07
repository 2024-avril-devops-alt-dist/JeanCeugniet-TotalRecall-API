import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "booking";
const response = "booking";
const collectionId = "bookingId"

// Récupérer un item
export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
                bookingBuyer: true,
                bookingPassenger: true,
                bookingFlight: true
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
        const { bookingBuyerId, bookingPassengerId, bookingFlightId, bookingSeat } = await req.json();

        // Vérifier si l'item existe dans la base de données
        const existingItem = await prisma[collection].findUnique({
            where: { [collectionId]: id },
        });
        if (!existingItem) {
            return NextResponse.json(
                { message: 'This booking does not exist' },
                { status: 404 }
            );
        }

        // Valider les données d'entrée
        if (!bookingBuyerId && !bookingPassengerId && !bookingFlightId && !bookingSeat) {
            return NextResponse.json(
                { message: 'At least one field is required to update booking' },
                { status: 400 }
            );
        }

        // Créer un objet de mise à jour basé sur les données reçues
        const updateData: any = {};
        updateData.bookingBuyerId = bookingBuyerId || existingItem.bookingBuyerId
        updateData.bookingPassengerId = bookingPassengerId || existingItem.bookingPassengerId;
        updateData.bookingFlightId = bookingFlightId || existingItem.bookingFlightId;
        updateData.bookingSeat = bookingSeat || existingItem.bookingSeat;

        // Vérifier s'il n'y a pas un item identique
        const existingBooking = await prisma[collection].findFirst({
            where: {
                AND: [
                    { bookingBuyerId: updateData.bookingBuyerId },
                    { bookingPassengerId: updateData.bookingPassengerId },
                    { bookingFlightId: updateData.bookingFlightId },
                    { bookingSeat: updateData.bookingSeat },
                ],
                NOT: {
                    [collectionId]: id, // Exclure l'item actuel de la recherche
                },
            },
        });
        if (existingBooking) {
            return NextResponse.json(
                { message: 'One existing booking with the same infos' },
                { status: 400 }
            );
        }

        // Mettre à jour l'item dans la base de données
        const updatedBooking = await prisma[collection].update({
            where: { [collectionId]: id },
            data: updateData,
        });

        // Retourner l'aéroport mis à jour avec un statut 200 (OK)
        return NextResponse.json(updatedBooking, { status: 200 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Cound not update the booking', error },
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
