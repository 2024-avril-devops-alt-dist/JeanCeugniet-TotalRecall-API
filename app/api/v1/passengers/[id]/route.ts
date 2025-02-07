import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "passenger";
const response = "passenger";
const collectionId = "passengerId"

// Récupérer un item
export const GET = async (req: NextRequest, { params }: { params: { id: string }}) => {
    const { id } = params;
    try {
        const data = await prisma[collection].findUnique({
            where: { [collectionId]: id },
            include: {
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

// Mettre à jour un item
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;

    try {
        // Lire les données envoyées dans le corps de la requête
        const { passengerClientId, passengerNationalCountryId, passengerDisability, passengerSpecifics } = await req.json();

        // Vérifier si l'item existe dans la base de données
        const existingItem = await prisma[collection].findUnique({
            where: { [collectionId]: id },
        });
        if (!existingItem) {
            return NextResponse.json(
                { message: 'This passenger does not exist' },
                { status: 404 }
            );
        }

        // Valider les données d'entrée
        if (!passengerClientId && !passengerNationalCountryId && !passengerDisability && !passengerSpecifics) {
            return NextResponse.json(
                { message: 'At least one field is required to update passenger' },
                { status: 400 }
            );
        }

        // Créer un objet de mise à jour basé sur les données reçues
        const updateData: any = {};
        updateData.passengerClientId = passengerClientId || existingItem.passengerClientId;
        updateData.passengerNationalCountryId = passengerNationalCountryId || existingItem.passengerNationalCountryId;
        updateData.passengerDisability = passengerDisability || existingItem.passengerDisability;
        updateData.passengerSpecifics = passengerSpecifics || existingItem.passengerSpecifics;

        // Mettre à jour l'item dans la base de données
        const updatedPassenger = await prisma[collection].update({
            where: { [collectionId]: id },
            data: updateData,
        });

        // Retourner l'item mis à jour avec un statut 200 (OK)
        return NextResponse.json(updatedPassenger, { status: 200 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Cound not update the passenger', error },
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
