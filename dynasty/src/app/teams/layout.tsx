import React from "react";
import * as Interfaces from "@/interfaces";
import TransactionList from "@/components/widgets/TransactionList";

export default function TeamsLayout({children}: Interfaces.ChildrenProps) {
  return (
    <div className="flex items-start">
      <div className="w-full">
        {children}
      </div>
      <div className="w-3/12 pl-5">
        <TransactionList/>
      </div>
    </div>
  );
}
