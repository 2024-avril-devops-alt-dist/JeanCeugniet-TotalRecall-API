import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { dbCheck } from "@/lib/db"
import User from "@/models/user"
const prisma = new PrismaClient();

const collection = "User"; 
const response = "users";
const id_collection = "user_id"


export const GET = async () => {
  
    try {
      const data = await prisma[collection].findMany();
      console.log('------------users : ', data)
      return NextResponse.json({ [response]: data ?? [] });
    } catch (error) {
      return NextResponse.json(
        { error: `Failed to fetch ${collection}` },
        { status: 500 }
      );
    }
  }

