// src/app/api/test-db/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  console.log ('1 dans export')
  try {
    console.log ('2 dans try')
    await prisma.$connect();
    console.log ('3 dans try après await')
    return NextResponse.json({ message: "Connexion à la base de donnéesaaa réussie" });
  } catch (error) {
    console.log ('4 dans catch')
    console.error("Erreur de connexion à la base de données:", error);
    return NextResponse.json(
      { message: "Erreur de connexion à la base de données", error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}