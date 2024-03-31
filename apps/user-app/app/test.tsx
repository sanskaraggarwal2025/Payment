"use client";

import { useBalance } from "@repo/store/balance";

export default function Test() {
  const balance = useBalance();
  return <div>
    hi there {balance}
  </div>
}