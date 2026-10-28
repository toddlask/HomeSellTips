import type { Metadata } from "next";
import { RoomBoard } from "@/components/room-board";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Room-by-room prep",
  description: "Check off prep tasks by room. Progress is saved in this browser. No account.",
  ogDescription: "Check off prep tasks by room. Progress stays in this browser.",
  path: "/tools/rooms",
});

export default function RoomsPage() {
  return (
    <>
      <h1>Room-by-room prep</h1>
      <p className="lede">
        Open a room, tick the tasks, and leave. The checks stay in this browser. There is no account.
      </p>
      <RoomBoard />
    </>
  );
}
