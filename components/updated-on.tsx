import { formatUpdatedOn } from "@/lib/dates";

export function UpdatedOn({ iso }: { iso: string }) {
  return <p className="updated">{`Updated on ${formatUpdatedOn(iso)}`}</p>;
}
