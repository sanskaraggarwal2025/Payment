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
    orderBy: { timestamp: 'desc' }
  });
  return txns.map((t) => {
    let sign = "";
    let message = "";
    let counterPartyName = "";
    if (t.fromUserId === currentUserId) {
      sign = "-";
      message = "sent money to";
      counterPartyName = t.toUser.name || "";
    } else if (t.toUserId === currentUserId) {
      sign = "+";
      message = "received money from";
      counterPartyName = t.fromUser.name || "";
    }
    return {
      amount: t.amount,
      fromUserName: t.fromUser.name,
      toUserName: t.toUser.name,
      sign: sign,
      message: `${message} ${counterPartyName}`,
      timestamp:t.timestamp
    };
  });
}
export default async function () {
  const history = await getP2pTransactions();

  return (
    <div className="w-full">
      <div className="h-[90vh]">
        <Center>
          <Card title="Transaction History">
            <div className="min-w-72 pt-2">
              {history.map((t) => (
                <div className="p-5 border bottom-1">
                  <div className="flex justify-between">
                    <div className="text-sm">{t.message}</div>
                    <div>
                      {t.sign} Rs {t.amount / 100}
                    </div>
                  </div>
                  <div className="text-slate-600 text-xs">{t.timestamp.toDateString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </Center>
      </div>
    </div>
  );
}
