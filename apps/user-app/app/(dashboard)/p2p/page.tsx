import { SendCard } from "../../../components/SendCard";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getP2pTransactions() {
  const session = await getServerSession(authOptions);
  const currentUserId = Number(session?.user?.id);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: Number(session?.user?.id) },
        { toUserId: Number(session?.user?.id) },
      ],
    },
    include: {
      fromUser: { select: { number: true } },
      toUser: { select: { number: true } },
    },
  });
  console.log("line 17", txns);

  return txns.map((t) => {
    let sign = "";
    if (t.fromUserId === currentUserId) {
      sign = "-";
    } else if (t.toUserId === currentUserId) {
      sign = "+";
    }
    return {
      amount: t.amount,
      fromUserNumber: t.fromUser.number,
      toUserNumber: t.toUser.number,
      sign: sign,
    };
  });
}
export default async function () {
  const history = await getP2pTransactions();

  return (
    <div className="w-full">
      <SendCard />
      {history.map((t) => (
        <>
          <h1>
            {t.sign}
            {t.amount / 100}
          </h1>
          <h1>{t.toUserNumber}</h1>
        </>
      ))}
    </div>
  );
}
