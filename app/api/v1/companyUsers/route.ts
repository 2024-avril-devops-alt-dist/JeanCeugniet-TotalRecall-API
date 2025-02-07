import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const collection = "companyUser";
const response = "companyUsers";
const collectionId = "companyUserId"

// Get all items
export const GET = async () => {
    try {
        const data = await prisma[collection].findMany({
            include: {
                companyUserCompany: true,
                companyUserUser: true
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
        const { companyUserUserId, companyUserCompanyId } = await req.json();

        // Valider les données d'entrée
        if (!companyUserUserId || !companyUserCompanyId) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Créer un nouvel companyUser dans la base de données avec Prisma
        const newCompanyUSer = await prisma.companyUser.create({
            data: {
                companyUserUserId,
                companyUserCompanyId,
            },
        });

        // Répondre avec l'objet créé et un statut 201 (Created)
        return NextResponse.json(newCompanyUSer, { status: 201 });
    }
    catch (error) {
        // En cas d'erreur, renvoyer un statut 500 (Internal Server Error)
        return NextResponse.json(
            { message: 'Couldn\'t create company user', error },
            { status: 500 }
        );
    }
}
