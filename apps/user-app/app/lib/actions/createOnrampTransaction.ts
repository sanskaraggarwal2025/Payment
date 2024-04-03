"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth";

export async function createOnRampTransaction(amount: number,provider: string) {
    console.log('line 8 createOnrampTransaction',amount);
    
    const session = await getServerSession(authOptions);
    if (!session?.user || !session?.user?.id) {
        return {
            msg: "Unauthenticated request"
        }
    }

    const token = (Math.random() * 1000).toString();
    await prisma.onRampTransaction.create({
        data: {
            provider,
            status: "Processing",
            startTime: new Date(),
            token: token,
            userId: Number(session?.user?.id),
            amount: amount 
        }
    });

    console.log('done');
    return {
        msg: "Done "
    }
}

