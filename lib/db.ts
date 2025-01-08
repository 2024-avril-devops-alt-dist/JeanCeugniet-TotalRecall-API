import { Prisma, PrismaClient } from "@prisma/client";
import {NextRequest, NextResponse} from "next/server";
//import {getRequiredFields} from "@/app/lib/utils";

const prisma = new PrismaClient();
type PrismaModels = Prisma.ModelName;

const prismaModelMapper: Record<PrismaModels, any> = {
    User: prisma.user,
    Company : prisma.company,
    Country: prisma.country,
    City : prisma.city,
    Airport : prisma.airport,
    Client : prisma.client,
    Buyer : prisma.buyer,
    Passenger : prisma.passenger,
    Flight : prisma.flight,
    Stopover : prisma.stopover,
    Booking : prisma.booking,
};

export function dbCheck() {
    if (!process.env.DATABASE_URI) {
      return NextResponse.json(
        { error: "DATABASE_URL is not set" },
        { status: 500 }
      );
    }
  }
/**
 * Check if entity exists.
 * @param entity
 * @returns null if entity exists, and is validated.
 */
export function validateEntity(entity: string): PrismaModels | null {
    const validEntities = Object.values(Prisma.ModelName);
    if (validEntities.includes(entity as PrismaModels)) {
        return entity as PrismaModels;
    }
    return null;
}

/**
 * Check if the entity required fields are missing.
 * @param entity
 * @param data
 * @returns null if no fields are missing.
 */
export async function validateEntityFields(entity: Prisma.ModelName, data: Record<string, any>) {

    try {
        const requiredFields = getRequiredFields(entity);

        const missingFields = requiredFields.filter((field) => !(field in data));
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        return null;
    } catch (error) {
        console.error("Validation error:", error);
        return NextResponse.json(
            { error: "Entity validation failed" },
            { status: 500 }
        );
    }

}

/**
 * Prisma findMany() dynamic method.
 * @param entity
 */
export async function prismaFindMany (entity: PrismaModels) {

    try {
        const model = prismaModelMapper[entity];
        const currentEntity = await model.findMany();
        return NextResponse.json(currentEntity ?? []);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch ${entity}` },
            { status: 500 }
        );
    }

}

/**
 * Prisma findUnique() dynamic method for getting a single record by ID.
 * @param entity
 * @param id
 */
export async function prismaFindById(entity: PrismaModels, id: string) {
    try {
        const model = prismaModelMapper[entity];

        const entityById = await model.findUnique({
            where: { id: id },
        });

        if (!entityById) {
            return NextResponse.json(
                { error: `${entity} with ID ${id} not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(entityById, { status: 200 });
    } catch (error) {
        console.error(`Error during ${entity} retrieval by ID:`, error);
        return NextResponse.json({ error: "Entity retrieval failed" }, { status: 500 });
    }
}

/**
 * Prisma create() dynamic method.
 * @param entity
 * @param req
 */
export async function prismaCreate (entity: PrismaModels, req: NextRequest) {

    try {
        const model = prismaModelMapper[entity];
        const body = await req.json();

        const validationError = await validateEntityFields(entity, body);
        if (validationError) return validationError;

        const createdEntity = await model.create({
            data: body,
        });

        return NextResponse.json(createdEntity, { status: 201 });
    } catch (error) {
        console.error(`Error during ${entity} creation:`, error);
        return NextResponse.json(
            { error: "Entity creation failed" },
            { status: 500 }
        );
    }

}

/**
 * Prisma update() dynamic method.
 * @param entity
 * @param req
 * @param id
 */
export async function prismaUpdate(entity: PrismaModels, req: NextRequest, id: string) {
    try {
        const model = prismaModelMapper[entity];
        const body = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Valid ID is required for update" }, { status: 400 });
        }

        const validationError = await validateEntityFields(entity, body);
        if (validationError) return validationError;

        const updatedEntity = await model.update({
            where: { id: String(id) },
            data: body,
        });

        return NextResponse.json(updatedEntity, { status: 200 });
    } catch (error) {
        console.error(`Error during ${entity} update:`, error);
        return NextResponse.json({ error: "Entity update failed" }, { status: 500 });
    }
}

/**
 * Prisma delete() dynamic method.
 * @param entity
 * @param id
 */
export async function prismaDelete(entity: PrismaModels, id: string) {
    try {
        const model = prismaModelMapper[entity];

        if (!id) {
            return NextResponse.json({ error: "Valid ID is required for delete" }, { status: 400 });
        }

        const deletedEntity = await model.delete({
            where: { id: String(id) },
        });

        return NextResponse.json({ message:`Entity ${id} deleted` }, { status: 200 });
    } catch (error) {
        console.error(`Error during ${entity} delete:`, error);
        return NextResponse.json({ error: "Entity delete failed" }, { status: 500 });
    }
}

export default prisma;