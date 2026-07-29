"use client";

import { useState } from "react";
import { Descriptions, Tag, Button, Input, Space, Alert } from "antd";
import { useFlagTransaction, useAddTransactionNote } from "@/hooks/useTransactionActions";
import { Transaction } from "@/interfaces/transactions";
import SohcahtoaDrawers from "../Drawers";
import { JwtClaims } from "@/lib/jwt";

interface Props {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  session?: JwtClaims;
}

const STATUS_COLOR: Record<Transaction["status"], string> = {
  pending: "gold",
  completed: "green",
  failed: "red",
  flagged: "volcano",
};

export default function TransactionDetailPanel({ transaction, open, onClose, session }: Props) {
  const [noteDraft, setNoteDraft] = useState("");
  // Display-only role check for hiding the button. NOT the security boundary
  // — see the 403 check in app/api/transactions/[id]/route.ts, which is what
  // actually stops a non-admin from flagging even if they call the API directly.
  const sessionRole = session?.role
  const isAdmin = sessionRole === "admin";

  const flag = useFlagTransaction();
  const addNote = useAddTransactionNote();

  if (!transaction) return null;
  const isFlagged = transaction.status === "flagged";

    return (
        <SohcahtoaDrawers
        placement={"right"}
        open={open}
        onClose={onClose}
        width={420}
        maskClosable
        title={transaction.reference}
        zIndex={2000}
      >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Status">
          <Tag color={STATUS_COLOR[transaction.status]}>{transaction.status.toUpperCase()}</Tag>
        </Descriptions.Item>

        {/*
          SECTION 5.1 XSS MITIGATION:
          `transaction.counterparty` can contain literal "<script>alert('xss')</script>"
          (seeded deliberately in lib/transactions/data.ts to exercise this).
          {transaction.counterparty} is JSX text interpolation — React escapes
          it into a text node (&lt;script&gt;...), so the browser displays the
          string as visible text and never parses or executes it as markup.
          This is the whole mitigation: we simply never route user-controlled
          strings through dangerouslySetInnerHTML anywhere in the app. The
          same reasoning applies to `note` below, which is also free-text
          user input.
        */}
        <Descriptions.Item label="Counterparty">{transaction.counterparty}</Descriptions.Item>

        <Descriptions.Item label="Amount">
          {transaction.currency} {transaction.amount.toFixed(2)}
        </Descriptions.Item>
        <Descriptions.Item label="Card">{transaction.cardNumber}</Descriptions.Item>
        <Descriptions.Item label="Date">{new Date(transaction.createdAt).toLocaleString()}</Descriptions.Item>
        {transaction.note && <Descriptions.Item label="Internal note">{transaction.note}</Descriptions.Item>}
      </Descriptions>

      <div className="mt-4">
        {isAdmin ? (
          <Button danger={!isFlagged} onClick={() => flag.mutate({ id: transaction.id, flagged: !isFlagged })} loading={flag.isPending}>
            {isFlagged ? "Remove flag" : "Flag transaction"}
          </Button>
        ) : (
          <Alert type="info" showIcon title="Only admins can flag transactions" />
        )}
      </div>

      <div className="mt-6">
        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Add an internal note"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            onPressEnter={() => {
              if (!noteDraft.trim()) return;
              addNote.mutate({ id: transaction.id, note: noteDraft.trim() }, { onSuccess: () => setNoteDraft("") });
            }}
          />
          <Button
            onClick={() => {
              if (!noteDraft.trim()) return;
              addNote.mutate({ id: transaction.id, note: noteDraft.trim() }, { onSuccess: () => setNoteDraft("") });
            }}
            loading={addNote.isPending}
          >
            Add
          </Button>
        </Space.Compact>
      </div>
    </SohcahtoaDrawers>
  );
}