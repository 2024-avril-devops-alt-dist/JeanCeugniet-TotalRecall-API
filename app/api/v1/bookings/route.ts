import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "booking";
const response = "bookings";
const collectionId = "bookingId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
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

// Create new item
export const POST = async (req: NextRequest) => {
    try {
        // Extraire les données du corps de la requête
        const { bookingBuyerId, bookingPassengerId, bookingFlightId, bookingSeat } = await req.json();

        // Valider les données d'entrée
        if (!bookingBuyerId || !bookingPassengerId || !bookingFlightId || !bookingSeat) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Vérifier si le buyer, le passenger et le flight existent dans la base de données
        const buyerExists = await prisma.buyer.findUnique({
            where: {
                buyerId: bookingBuyerId,
            },
        });

        if (!buyerExists) {
            return NextResponse.json(
                { message: 'Buyer does not exist.' },
                { status: 404 }
            );
        }

        const passengerExists = await prisma.passenger.findUnique({
            where: {
                passengerId: bookingPassengerId,
            },
        });

        if (!passengerExists) {
            return NextResponse.json(
                { message: 'Passenger does not exist.' },
                { status: 404 }
            );
        }

        const flightExists = await prisma.flight.findUnique({
            where: {
                flightId: bookingFlightId,
            },
        });

        if (!flightExists) {
            return NextResponse.json(
                { message: 'Flight does not exist.' },
                { status: 404 }
            );
        }

        // Vérifier qu'on n'a pas déjà le même siège réservé sur ce vol
        const seatTaken = await prisma.booking.findFirst({
            where: {
                bookingFlightId,
                bookingSeat
            },
        });

        if(seatTaken) {
            return NextResponse.json(
                { message: 'Seat already taken on this flight.' },
                { status: 400 }
            );
        }

        // Créer un nouvel aéroport dans la base de données avec Prisma
        const newBooking = await prisma.booking.create({
            data: {
                bookingBuyerId, 
                bookingPassengerId, 
                bookingFlightId, 
                bookingSeat
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newBooking, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create booking', error },
            { status: 500 }
        );
    }
}

