import Image from "next/image";
import { Card } from "@repo/ui/card";
import { Code } from "@repo/ui/code";
import styles from "./page.module.css";
import { Button } from "@repo/ui/button";
import Test from "./test";
export default function Page(): JSX.Element {
  return (
    <>
      <h1 className="font-bold text-2xl">hiii</h1>
      <Test />
    </>
  );
}
