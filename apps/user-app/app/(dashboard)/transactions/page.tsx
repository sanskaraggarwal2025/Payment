import { Card } from "@repo/ui/card";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Center } from "@repo/ui/center";
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
      fromUser: { select: { name: true } },
      toUser: { select: { name: true } },
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
      fromUserName: t.fromUser.name,
      toUserName: t.toUser.name,
      sign: sign,
    };
  });
}
export default async function () {
  const history = await getP2pTransactions();

  return (
    <div className="w-full">
    <div className="h-[90vh]">
      <Center>
        <Card title="Recent Transactions">
          <div className="min-w-72 pt-2">
            {history.map((t) => (
              <>
                <div>
                  <div className="text-sm">Received INR</div>
                  <div className="text-slate-600 text-xs">{t.toUserName}</div>
                </div>
                <div className="flex flex-col justify-center">
                  {t.sign} Rs {t.amount / 100}
                </div>
              </>
            ))}
          </div>
        </Card>
      </Center>
    </div>
    </div>
  );
}
