export type RoomTask = {
  id: string;
  label: string;
};

export type RoomPrep = {
  id: string;
  name: string;
  tasks: readonly RoomTask[];
};

export const ROOM_PREP: readonly RoomPrep[] = [
  {
    id: "entry",
    name: "Entry",
    tasks: [
      { id: "entry-mat", label: "Shake out the mat and sweep the threshold." },
      { id: "entry-light", label: "Replace any bulb that is out by the door." },
      { id: "entry-keys", label: "Move spare keys and mail out of sight." },
      { id: "entry-path", label: "Leave a clear path from the door into the first room." },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    tasks: [
      { id: "kitchen-counters", label: "Clear the counters down to a few useful items." },
      { id: "kitchen-fridge", label: "Take papers and magnets off the refrigerator." },
      { id: "kitchen-sink", label: "Empty the sink and wipe the faucet." },
      { id: "kitchen-floor", label: "Sweep the floor and the toe-kick." },
    ],
  },
  {
    id: "living",
    name: "Living areas",
    tasks: [
      { id: "living-surfaces", label: "Clear tables so the room reads as open." },
      { id: "living-cords", label: "Tape or hide loose cords along the wall." },
      { id: "living-pillows", label: "Fold throws and set pillows in one place." },
      { id: "living-windows", label: "Open the blinds you plan to leave open for photos." },
    ],
  },
  {
    id: "bedrooms",
    name: "Bedrooms",
    tasks: [
      { id: "bed-make", label: "Make the beds and put clothes in closets or hampers." },
      { id: "bed-night", label: "Clear nightstands except a lamp." },
      { id: "bed-floor", label: "Pick up the floor so the edges of the room show." },
    ],
  },
  {
    id: "bathrooms",
    name: "Bathrooms",
    tasks: [
      { id: "bath-counter", label: "Put daily bottles in a cabinet." },
      { id: "bath-towels", label: "Hang a matched set of towels." },
      { id: "bath-glass", label: "Wipe the mirror, faucet, and glass." },
      { id: "bath-trash", label: "Empty the trash and the shower caddy." },
    ],
  },
  {
    id: "outside",
    name: "Outside",
    tasks: [
      { id: "out-walk", label: "Sweep the walk, steps, and porch." },
      { id: "out-hose", label: "Coil the hose and put bins out of the photo line." },
      { id: "out-plants", label: "Trim plants that cover the house number or a window." },
    ],
  },
];

export function roomTaskIds(): string[] {
  return ROOM_PREP.flatMap((room) => room.tasks.map((task) => task.id));
}
