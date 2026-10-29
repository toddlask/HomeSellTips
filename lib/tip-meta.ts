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
    "Walk the house with a notepad before you hire anyone, so fixes, disclosures, and jobs you will skip are written down before the first bid.",
  "fix-function-before-finish":
    "Fix function before you buy paint. Leaks, heat, latches, and dead outlets show up on a first visit, and a fresh coat will not hide them.",
  "deep-clean-after-the-dusty-work":
    "Deep-clean after the dusty work, not before. Finish the dusty repairs, let the dust settle, then clean from the lights down to the floors.",
  "clear-surfaces-before-you-decorate":
    "Clear surfaces before you add decor, so a buyer can see the room. One useful item on a counter does more than a pile of extras.",
  "pack-personal-items-early":
    "Pack personal items before the first showing so photos, mail, and papers are gone and the rooms show the house instead of your daily life.",
  "price-the-property-you-have":
    "Price the property you have by comparing sold homes you can check, then write the net you will accept before you pick a list price.",
  "leave-room-to-negotiate":
    "Leave room to answer a real offer. A list price with space for a credit can still hit the net you wrote down before the first bid.",
  "daylight-and-lights":
    "Take listing photos in daylight with the lights on and the camera level, so corners stay visible and the rooms look the size they are.",
  "show-the-repairs-you-finished":
    "Photograph the work you finished in its own clear frame, and lead with the front of the house so a finished repair answers a question early.",
  "list-the-jobs-before-you-choose":
    "List the jobs in a sale before you pick who does them, so hours and dollars are on paper whether you hire an agent or sell the house yourself.",
  "questions-if-you-sell-it-yourself":
    "Questions to answer if you sell it yourself: which forms apply, how showings get booked, and who reads the first offer before you sign it.",
  "read-the-whole-offer":
    "Read the whole offer before you answer the price. Credits, dates, and contingencies change the money more than the headline number does.",
  "compare-net-and-dates":
    "Compare net and dates on one row per offer, then counter the gap in plain numbers so a deadline does not pass while you still want the deal.",
  "build-the-closing-folder-early":
    "Build the closing folder before you have a buyer. Payoff contacts, receipts, and a plan to confirm wire instructions belong in one place.",
  "walk-again-before-the-final-visit":
    "Walk the house again before the buyer's final visit, with the contract in hand, so agreed repairs are done and the house matches what you signed.",
  "book-the-move-after-the-date-is-real":
    "Book the move after the closing date is real, not when you hope it will be, so the truck is reserved for a day the contract already names.",
  "label-boxes-by-room":
    "Label boxes by the room they go to, on more than one side, so movers and you can unload without opening every carton in the new place.",
  "replace-cracked-caulk-before-photos":
    "Replace cracked caulk before photo day. A tube and a scraper are a small hardware-store job, and fresh lines keep a damp edge from showing.",
  "finish-the-entry-first":
    "Finish the entry before the rest of the house. The first steps inside set what a visitor expects, and they cost less than redoing every room.",
  "test-alarms-before-you-list":
    "Test the alarms before you list. A fresh battery is a few dollars, and a detector that chirps during a showing is a problem you can fix now.",
  "clear-gutters-before-showings":
    "Clear the gutters before showings so overflow does not stain the entry. Gloves and a ladder afternoon are enough for a one-story run.",
  "tighten-loose-hardware":
    "Tighten loose hardware before the first visit. Hinges and pulls that rattle are a screwdriver job, often under $15 in screws from a hardware store.",
  "trace-a-stain-to-its-source":
    "Trace a stain to its source before you paint over it. Find the leak, stop it, and let the spot dry so the repair is real and not a cover.",
  "run-heat-and-cooling-before-showings":
    "Run the heat and the cooling before showings. A system that starts, and a filter you can point to, answers the question buyers test first.",
  "leave-a-clear-path-through-each-room":
    "Leave a clear path through each room so a visitor can walk from the front door to the back without stepping around chairs, bins, or cords.",
  "open-the-window-coverings-the-same-way":
    "Open the window coverings the same way in every room you will show, so daylight is consistent and no corner is left in the dark for a photo.",
  "put-pet-gear-away-before-showings":
    "Put pet gear away before showings. Bowls, beds, and toys in a closet let the room read as a room, and you can set them back out the same day.",
  "stop-after-one-simple-table-setting":
    "Stop after one simple table setting. A made table for the people who live there is enough. Extra place settings make a dining room look staged stiff.",
  "leave-closets-partly-empty":
    "Leave closets partly empty so a door can open and a buyer can see the rod and the floor. A packed closet reads as too little storage.",
  "write-three-numbers-before-you-list":
    "Write three numbers before you list: the price you will advertise, the net you hope to clear, and the lowest net you will accept.",
  "list-credits-before-you-pick-a-price":
    "List credits before you pick a price. Repair money and closing help change the net, so write those possibilities down while you are calm.",
  "match-what-was-included-in-a-sale":
    "Match what was included in a sold home you are using as a comparison, so a missing garage or a smaller lot is not treated as the same house.",
  "rerun-the-net-after-each-bid":
    "Rerun the net after each repair bid. A new number for a roof or a faucet belongs in the proceeds page before you decide to do the work.",
  "keep-price-notes-in-writing":
    "Keep price notes in writing. The sold homes you compared, and why you adjusted, should be on a page you can read again when an offer arrives.",
  "shoot-in-the-order-a-visitor-walks":
    "Shoot in the order a visitor walks, from the street to the back of the house, so the photo set tells the same story as the showing.",
  "move-cars-before-the-photo-appointment":
    "Move cars before the photo appointment so the driveway and the front of the house are clear. A car in the frame hides the property you are selling.",
  "close-lids-and-hide-trash-cans":
    "Close lids and hide trash cans before any photo. A shut toilet lid and a bin moved out of the corner keep the picture about the room.",
  "take-one-wide-shot-and-one-detail":
    "Take one wide shot and one detail in each main room, so the set shows both the space and the finished work a buyer will ask about.",
  "delete-blurry-frames-the-same-day":
    "Delete blurry frames the same day you shoot. A dark or soft photo left in the set is the one people remember, and a retake is still easy.",
  "price-the-hours-you-will-spend":
    "Price the hours you will spend if you sell it yourself. Showings, calls, and paperwork are time. Write that cost next to any commission you skip.",
  "decide-who-answers-buyer-questions":
    "Decide who answers buyer questions before the sign goes up, so calls have one owner and you are not improvising a price on the phone.",
  "learn-which-forms-you-must-use":
    "Learn which forms you must use in your state before you list. A closing company or attorney can name them. This site cannot pick them for you.",
  "plan-showing-hours-before-you-advertise":
    "Plan showing hours before you advertise, and write hours you can keep. A buyer who cannot get in does not get a fair look at the house.",
  "write-what-you-will-not-negotiate":
    "Write what you will not negotiate, such as a move-out date you already booked, and read that list before you answer a call or a counter.",
  "answer-an-offer-in-writing":
    "Answer an offer in writing, even after you have talked it through. A sentence with the price, credits, and dates is the copy you can file.",
  "split-price-from-the-closing-date":
    "Split price from the closing date when you counter. One line for the money and one line for the day keeps the two decisions easy to compare.",
  "list-what-stays-before-you-sign":
    "List what stays before you sign, including appliances and window coverings, so a refrigerator you plan to take is not assumed to be part of the sale.",
  "ask-who-pays-for-requested-repairs":
    "Ask who pays for requested repairs before you agree. A bid or a credit amount, and a name for who orders the work, belongs in the written answer.",
  "save-every-counter-you-send":
    "Save every counter you send, numbered by date, in one folder. The next version is easier to read when you can see only the lines that changed.",
  "read-the-settlement-statement-when-it-arrives":
    "Read the settlement statement when it arrives. Check price, payoff, and credits against the contract before closing day, not in the lobby.",
  "match-the-move-out-date-to-the-contract":
    "Match the move-out date to the contract. Book the truck so the house is empty before the possession day, with time left for keys and a last look.",
  "gather-keys-and-openers-in-one-envelope":
    "Gather keys and openers in one envelope, labeled with the address, and carry it to closing. Do not pack the only set in a moving box.",
  "check-your-name-against-your-id":
    "Check your name against your ID before closing day. A missing initial can stall a signing, and the closing office can fix it if you call early.",
  "leave-utility-numbers-for-the-final-reading":
    "Leave utility numbers for the final reading on the possession date. Write the confirmation, and do not shut a service off earlier than the contract allows.",
  "measure-doors-before-you-book-a-truck":
    "Measure doors and the largest furniture before you book a truck, so a sofa that will not pass is a decision you make at home, not on the ramp.",
  "pack-a-first-week-kitchen-box":
    "Pack a first-week kitchen box with a pan, mugs, soap, and towels, mark it to open first, and carry it in your car in case the truck is late.",
  "forward-the-mail-before-you-leave":
    "Forward the mail before you leave, with a start date that matches possession. A forward does not update your insurer or the bills you pay.",
  "photograph-empty-rooms-on-the-last-day":
    "Photograph the empty rooms on the last day, plus the meter readings, and save the set with your settlement papers before you lock the door.",
  "carry-the-closing-papers-with-you":
    "Carry the closing papers with you in the car, not in a box on the truck, so the signed set and your identification stay where you can reach them.",
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
