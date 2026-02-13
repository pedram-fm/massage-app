"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { TodoBoard } from "@/components/todos/TodoBoard";
import { ROUTES } from "@/modules/shared/navigation/routes";

export default function UserTodosPage() {
  return (
    <TodoBoard
      wrapperClassName='bg-[color:var(--surface)] text-[color:var(--brand)]'
      containerClassName="px-4 py-6 lg:px-6 lg:py-8"
      titleClassName="text-3xl font-bold"
      headerSlot={
        <Link
          href={ROUTES.HOME}
          className="mb-2 inline-flex items-center gap-2 text-sm text-[color:var(--muted-text)] transition hover:text-[color:var(--brand)]"
        >
          <Home className="h-4 w-4" />
          بازگشت به خانه
        </Link>
      }
    />
  );
}
