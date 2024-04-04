import { SendCard } from "../../../components/SendCard";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getP2pTransactions(){
    const session = await getServerSession(authOptions)
    const txns = await prisma.p2pTransfer.findMany({
        where:{
            OR: [
                {fromUserId:Number(session?.user?.id)},
                {toUserId:Number(session?.user?.id)}
            ]
        }
    })
    console.log('line 17',txns);
    return txns.map((t) => ({
        amount:t.amount,
    }))
    
}
export default async function() {
    console.log(getP2pTransactions());
    const history = await getP2pTransactions()
    
    return <div className="w-full">
        <SendCard />
        {
            history.map((t) => (
                <h1>{(t.amount)/100}</h1>
            ))
        }
    </div>
}