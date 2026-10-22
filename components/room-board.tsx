"use client";

import { useEffect, useState } from "react";
import { ROOM_PREP, roomTaskIds } from "@/lib/rooms";

const STORAGE_KEY = "homeselltips-room-prep";

function readSaved(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const saved: Record<string, boolean> = {};
    for (const id of roomTaskIds()) {
      if ((parsed as Record<string, unknown>)[id] === true) {
        saved[id] = true;
      }
    }
    return saved;
  } catch {
    return {};
  }
}

export function RoomBoard() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState<string>(ROOM_PREP[0]?.id ?? "");
  const total = roomTaskIds().length;
  const done = roomTaskIds().filter((id) => saved[id]).length;

  useEffect(() => {
    setSaved(readSaved());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [ready, saved]);

  return (
    <div className="room-board">
      <p className="room-progress" role="status">
        {done} of {total} tasks checked. Saved in this browser only.
      </p>
      <ul className="room-list">
        {ROOM_PREP.map((room) => {
          const roomDone = room.tasks.filter((task) => saved[task.id]).length;
          const open = openId === room.id;
          return (
            <li key={room.id} className="room-card">
              <button
                type="button"
                className="room-toggle"
                aria-expanded={open}
                aria-controls={`${room.id}-tasks`}
                onClick={() => setOpenId(open ? "" : room.id)}
              >
                <span>{room.name}</span>
                <span>
                  {roomDone} of {room.tasks.length}
                </span>
              </button>
              {open ? (
                <ul id={`${room.id}-tasks`} className="checklist">
                  {room.tasks.map((task) => (
                    <li key={task.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={saved[task.id] === true}
                          onChange={() =>
                            setSaved((current) => ({ ...current, [task.id]: current[task.id] !== true }))
                          }
                        />
                        <span>{task.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
