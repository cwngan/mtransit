"use client";
import { Suspense } from "react";
import Home from "./components/Home";

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
