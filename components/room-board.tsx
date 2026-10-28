"use client";

import { useState, useSyncExternalStore } from "react";
import { ROOM_PREP, roomTaskIds } from "@/lib/rooms";

const STORAGE_KEY = "homeselltips-room-prep";
const STORAGE_EVENT = "homeselltips-room-prep";

function parseSaved(raw: string | null): Record<string, boolean> {
  if (!raw) {
    return {};
  }
  try {
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

const EMPTY_SAVED: Record<string, boolean> = {};
let cachedRaw: string | null | undefined;
let cachedSaved: Record<string, boolean> = EMPTY_SAVED;

function readSaved(): Record<string, boolean> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedSaved;
  }
  cachedRaw = raw;
  cachedSaved = parseSaved(raw);
  return cachedSaved;
}

function subscribe(onChange: () => void) {
  window.addEventListener(STORAGE_EVENT, onChange);
  return () => window.removeEventListener(STORAGE_EVENT, onChange);
}

function emptySaved(): Record<string, boolean> {
  return EMPTY_SAVED;
}

function writeSaved(saved: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  cachedRaw = localStorage.getItem(STORAGE_KEY);
  cachedSaved = saved;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function RoomBoard() {
  const saved = useSyncExternalStore(subscribe, readSaved, emptySaved);
  const [openId, setOpenId] = useState<string>(ROOM_PREP[0]?.id ?? "");
  const total = roomTaskIds().length;
  const done = roomTaskIds().filter((id) => saved[id]).length;

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
                            writeSaved({ ...saved, [task.id]: saved[task.id] !== true })
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
