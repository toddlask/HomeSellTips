import type { Tip } from "@/lib/types";

export function tipKeyPhrase(title: string): string {
  const normalized = title.replaceAll("’", "'");
  const before = normalized.split(" before ")[0] ?? normalized;
  if (before !== normalized && before.length >= 12) {
    return before;
  }
  if (normalized.length <= 46) {
    return normalized;
  }
  return normalized.split(" ").slice(0, 5).join(" ");
}

const TIP_META = {
  "walk-the-house-before-you-hire":
    "Pre-listing walkthrough: a slow walk with a notepad shows what to fix, what to tell buyers, and what to leave alone. Write it down before you hire help.",
  "fix-function-before-finish":
    "What to fix before selling a house: repair leaks, heat, and latches before you buy paint. Stop the things that fail before you buy finish. Do it for this house.",
  "deep-clean-after-the-dusty-work":
    "Deep cleaning before selling house: clean after the dusty repairs, not before. Sanding, patching, and caulk throw dust. Write it down before you list.",
  "clear-surfaces-before-you-decorate":
    "Declutter before selling house: empty counters and floors do more for a showing than extra decor. Write it down for this house before you hire anyone.",
  "pack-personal-items-early":
    "Depersonalize house for sale: box photos, mail, and papers so the rooms show the house. Write it down for this house before you hire anyone or set a date.",
  "price-the-property-you-have":
    "How to price my house to sell: compare sold homes that match this property, then write the net you will accept. Write it down for this house before you list.",
  "leave-room-to-negotiate":
    "List price negotiation room: set the list price with room for a credit and still hit your net. The list price is the number on the ad. Do it for this house.",
  "daylight-and-lights":
    "Best time of day for real estate photos: open the shades, turn on the lamps, and keep the camera level. The camera needs more light than your eyes do.",
  "show-the-repairs-you-finished":
    "Listing photos of upgrades: give finished repairs their own clear photo, and lead with the front of the house. People scroll quickly. Do it for this house.",
  "list-the-jobs-before-you-choose":
    "Realtor vs FSBO: write every job in a sale, then decide who will do it and what it costs you. Write it down for this house before you hire anyone else.",
  "questions-if-you-sell-it-yourself":
    "Selling a house by owner: forms, showings, and offer review are still yours if you sell without an agent. Write it down for this house before you list.",
  "read-the-whole-offer":
    "How to read a purchase offer: credits, dates, and contingencies change the money more than the headline price. Write it down for this house before you list.",
  "compare-net-and-dates":
    "How to compare offers on a house: put each offer on one row and counter the gap in your net. Write it down for this house before you hire anyone else.",
  "build-the-closing-folder-early":
    "Documents needed to sell a house: collect payoff contacts, receipts, and a wire-check plan before you are under contract. Write it down for this house.",
  "walk-again-before-the-final-visit":
    "Final walkthrough seller: check the fixtures you promised to leave, and report anything that broke. Write it down for this house before you hire help.",
  "book-the-move-after-the-date-is-real":
    "When to book movers when selling a house: wait for a contract date, then book the truck with a written backup plan. Write it down before you hire help.",
  "label-boxes-by-room":
    "How to label moving boxes: name the room on two sides of every box and keep a first-night box with you. Write the room and a short contents line on every box.",
  "replace-cracked-caulk-before-photos":
    "Recaulk before selling house: cracked caulk shows up in close photos. Replace it while the repair list is still short. Write it down before you hire help.",
  "finish-the-entry-first":
    "Entryway staging: the front door and entry are the first rooms a visitor stands in. Finish those before the back closets. Write it down for this house.",
  "test-alarms-before-you-list":
    "Smoke detector requirements when selling a house: press each smoke and carbon-monoxide alarm, and replace any battery that fails. Do it for this house.",
  "clear-gutters-before-showings":
    "Clean gutters before selling house: empty the gutters and check that downspouts send water away from the foundation. Write it down before you hire help.",
  "tighten-loose-hardware":
    "Small repairs before selling house: snug the hinges, handles, and cabinet pulls that rattle when someone opens a door. Write it down before you hire help.",
  "trace-a-stain-to-its-source":
    "Water stain on ceiling selling house: find the leak that made the stain, then repair that before you paint over the mark. Write it down for this house.",
  "run-heat-and-cooling-before-showings":
    "HVAC check before selling house: turn each system on, listen for a short cycle, and change a dirty filter. Turn the heat on and wait. Do it for this house.",
  "leave-a-clear-path-through-each-room":
    "Furniture arrangement for staging: move chairs and baskets so a visitor can walk in, turn around, and see the floor. Write it down before you hire help.",
  "open-the-window-coverings-the-same-way":
    "Natural light staging tips: raise every shade to the same height so the light looks even from room to room. Write it down for this house before you list.",
  "put-pet-gear-away-before-showings":
    "Selling a house with pets: move bowls, beds, and litter out of sight, and air the rooms they sat in. Write it down for this house before you hire help.",
  "stop-after-one-simple-table-setting":
    "Dining table staging ideas: a plain setting on the table is enough. Extra decor on every surface works against you. Write it down before you hire help.",
  "leave-closets-partly-empty":
    "Closet staging tips: take out enough clothes and boxes that a visitor can see the rod and the floor. Write it down for this house before you hire help.",
  "write-three-numbers-before-you-list":
    "Home pricing strategy: write the list price, the net you hope for, and the net that would make you walk away. Write it down for this house before you list.",
  "list-credits-before-you-pick-a-price":
    "Seller credits closing costs: write the repairs and concessions you already expect, then see what they do to your net. Write it down before you hire help.",
  "match-what-was-included-in-a-sale":
    "How to read comps: before you compare a sold price, write what that sale included and what yours includes. Write it down for this house before you list.",
  "rerun-the-net-after-each-bid":
    "Net proceeds after repairs: when a written bid arrives, put that number in the calculator before you agree to the work. A bid is a fact. Do it for this house.",
  "keep-price-notes-in-writing":
    "Price reduction strategy: after each pricing talk, write the price, the net, and what you decided. A phone call is easy to remember two different ways.",
  "shoot-in-the-order-a-visitor-walks":
    "Listing photo order: start at the street, then move through the house in the order someone would walk it. Write it down for this house before you list.",
  "move-cars-before-the-photo-appointment":
    "Exterior listing photos tips: clear the driveway and the curb in front of the house so the photo shows the property. Write it down before you hire help.",
  "close-lids-and-hide-trash-cans":
    "Prepare house for real estate photos: shut toilet lids, tuck trash cans into cabinets, and clear the edge of every tub. Write it down before you list.",
  "take-one-wide-shot-and-one-detail":
    "How many listing photos: for each main room, keep one photo that shows the whole room and one that shows a finished feature. Write it down for this house.",
  "delete-blurry-frames-the-same-day":
    "Editing listing photos: review the set before you upload it, and drop any frame that is dark, tilted, or soft. Write it down for this house before you list.",
  "price-the-hours-you-will-spend":
    "Is FSBO worth it: write the tasks you would take on, then estimate the hours before you decide to sell it yourself. Write it down before you hire help.",
  "decide-who-answers-buyer-questions":
    "FSBO buyer questions: name the person who will reply, and decide that replies go in writing. Write it down for this house before you hire anyone else.",
  "learn-which-forms-you-must-use":
    "FSBO paperwork: before you advertise, ask which seller forms your state expects and where to get them. Rules vary by state. Write it down for this house.",
  "plan-showing-hours-before-you-advertise":
    "FSBO showings: choose the days and hours you can leave the house, and write them down before the first call. Write it down for this house before you list.",
  "write-what-you-will-not-negotiate":
    "Seller negotiation tips: before the first call, list the terms you will discuss and the ones you will not. Write it down for this house before you list.",
  "answer-an-offer-in-writing":
    "How to counter offer on a house: send a written yes, no, or counter, even when you already talked it through. Write it down for this house before you list.",
  "split-price-from-the-closing-date":
    "Negotiating closing date: when you counter, change the price on one line and the closing date on another. Write it down for this house before you list.",
  "list-what-stays-before-you-sign":
    "What stays with the house when you sell: write the appliances, fixtures, and window coverings that stay, and the items you will take. Do it for this house.",
  "ask-who-pays-for-requested-repairs":
    "Repair requests after inspection: when a buyer asks for a repair, write the cost and who pays it before you agree. Write it down before you hire help.",
  "save-every-counter-you-send":
    "Counter offer records: keep a copy of each counter in one folder, in the order you sent them. Write it down for this house before you hire anyone else.",
  "read-the-settlement-statement-when-it-arrives":
    "Seller settlement statement explained: check the price, credits, and payoff on the statement the day you receive it. The statement is the math of the sale.",
  "match-the-move-out-date-to-the-contract":
    "When do sellers have to move out: read the date you must be out, and book the move to finish before that day. Write it down for this house before you list.",
  "gather-keys-and-openers-in-one-envelope":
    "What to leave for new homeowners: put every key, garage opener, and gate code in one labeled envelope before closing day. Write it down for this house.",
  "check-your-name-against-your-id":
    "Name mismatch on deed: read the name on the deed papers and make sure it matches the identification you will bring. Write it down before you hire help.",
  "leave-utility-numbers-for-the-final-reading":
    "Transfer utilities when selling house: write the account numbers and schedule the final readings for the possession date. Write it down for this house.",
  "measure-doors-before-you-book-a-truck":
    "Moving truck size guide: measure the sofa, the mattress, and the narrowest doorway before you reserve a truck. Write it down for this house before you list.",
  "pack-a-first-week-kitchen-box":
    "Moving essentials box: fill one box with the pan, mugs, soap, and towels you will want before the rest is unpacked. Write it down before you hire help.",
  "forward-the-mail-before-you-leave":
    "How to forward mail when moving: file the mail forward in time for it to start on your possession date. Write it down for this house before you hire help.",
  "photograph-empty-rooms-on-the-last-day":
    "Move-out photos: take a photo of each empty room, plus the meter readings, before you lock the door. Write it down for this house before you hire help.",
  "carry-the-closing-papers-with-you":
    "Keep home sale documents: keep the signed settlement set in your car, not in a box on the truck. Write it down for this house before you hire anyone else.",
  "seller-closing-costs":
    "Seller closing costs: what sellers pay, from commission and payoff to title charges and credits, and how to estimate the net before you sign.",
  "realtor-commission-changes":
    "Realtor commission changes: what sellers should know before listing, including negotiable pay and a calculator that uses only your numbers.",
  "selling-as-is-vs-fixing-up":
    "Selling a house as is versus fixing it up is a written choice: list repairs, price what has to work, and compare the net if you leave the rest.",
} as const satisfies Record<string, string>;

export function tipMetaDescription(tip: Pick<Tip, "slug" | "summary" | "status">): string {
  if (tip.status !== "published") {
    return tip.summary;
  }
  const text = TIP_META[tip.slug as keyof typeof TIP_META];
  if (!text) {
    throw new Error(`Missing meta description for ${tip.slug}`);
  }
  return text;
}
