/**
 * 511(b) Amenity Reality — paste (1) travel/view date vs Oct 19 2026,
 * (2) delay cause chip (ten 511(b) events + other controllable + weather/NAS + unsure),
 * (3) overnight stranded? → Amenity-likely / Amenity-unlikely / Pre-rule / Unsure share card.
 * Brand: 511(b) Amenity Reality only. User paste only — no PNR scrape.
 * Not legal advice. Not a claim filer. Amenities are airline-specific commitments.
 * Never invents airline official BTS code or $ hotel/meal amounts.
 * Refund rights for cancel/significant change are SEPARATE (flightrights.gov).
 */
(function () {
  "use strict";

  const FR_URL =
    "https://www.federalregister.gov/documents/2026/09/03/2026-18040/cause-of-airline-delay-and-cancellation-categories-under-section-511b-of-the-faa-reauthorization-act";
  const CROWELL_URL =
    "https://www.crowell.com/en/insights/client-alerts/DOT-Final-Rule-Narrows-Airline-Delay-and-Cancellation-Reporting-Obligation-Under-FAA-Reauthorization-Act-of-2024";
  const VFTW_URL =
    "https://viewfromthewing.com/your-plane-breaks-but-the-airline-may-no-longer-owe-you-a-hotel-dot-finalizes-new-rule-to-shift-costs-to-passengers/";
  const SF_URL =
    "https://simpleflying.com/us-airlines-no-longer-owe-meals-hotels-uncontrollable-delays/";
  const FLIGHTRIGHTS = "https://flightrights.gov/";
  const DOT_REFUNDS =
    "https://www.transportation.gov/individuals/aviation-consumer-protection/refunds";

  const EFFECTIVE_ISO = "2026-10-19";
  const EFFECTIVE_LABEL = "Oct 19 2026";
  const FR_DOC = "2026-18040";

  /**
   * Ten statutory Section 511(b) events (FR Sep 3 2026) + framing buckets.
   * bucket: "511b" | "controllable" | "uncontrollable" | "unsure"
   */
  const CAUSES = [
    {
      id: "mx_unscheduled",
      label: "Unscheduled non-deferrable maintenance",
      short: "Unscheduled MX",
      bucket: "511b",
    },
    {
      id: "medical",
      label: "Medical emergency (no fault of carrier)",
      short: "Medical emergency",
      bucket: "511b",
    },
    {
      id: "unruly",
      label: "Unruly passenger removal",
      short: "Unruly removal",
      bucket: "511b",
    },
    {
      id: "cyber",
      label: "Compliant cybersecurity attack",
      short: "Cyberattack",
      bucket: "511b",
    },
    {
      id: "gov_system",
      label: "Unexpected gov system failure (safe flight)",
      short: "Gov system failure",
      bucket: "511b",
    },
    {
      id: "aircraft_damage",
      label: "Aircraft damage (weather / FOD / sabotage)",
      short: "Aircraft damage",
      bucket: "511b",
    },
    {
      id: "bag_system",
      label: "Bag-system outage (not carrier/contractor-controlled)",
      short: "Bag-system outage",
      bucket: "511b",
    },
    {
      id: "brakes",
      label: "Overheated brakes (safety emergency procedures)",
      short: "Overheated brakes",
      bucket: "511b",
    },
    {
      id: "death_cleaning",
      label: "Passenger-death cleaning",
      short: "Death cleaning",
      bucket: "511b",
    },
    {
      id: "volcanic",
      label: "Airport closure (volcanic ash / wind / wind shear)",
      short: "Volcanic / wind closure",
      bucket: "511b",
    },
    {
      id: "other_controllable",
      label: "Other “Air Carrier” controllable",
      short: "Other controllable",
      bucket: "controllable",
    },
    {
      id: "weather_nas",
      label: "Weather / NAS / security / late aircraft",
      short: "Weather / NAS / security / late acft",
      bucket: "uncontrollable",
    },
    {
      id: "unsure",
      label: "Unsure",
      short: "Unsure",
      bucket: "unsure",
    },
  ];

  const CAUSE_BY_ID = {};
  CAUSES.forEach(function (c) {
    CAUSE_BY_ID[c.id] = c;
  });

  const TEN_511B_IDS = CAUSES.filter(function (c) {
    return c.bucket === "511b";
  }).map(function (c) {
    return c.id;
  });

  const CITE_ONE_LINER =
    "Federal Register Sep 3 2026 final rule (2026-18040 / DOT-OST-2026-1257) implements FAA Reauth §511(b): ten statutory events excluded from “Air Carrier” reporting, effective October 19 2026. Crowell Sep 3: customer-service-plan amenities for controllable delays are no longer obligated when disruption is coded 511(b). View from the Wing Sep 4 / Simple Flying Sep 5: U.S. meal/hotel amenities are commitment-based and shrink when events leave Air Carrier. This card maps your pasted cause chip only — never invents a BTS code or $ amount. Not legal advice. Not a claim filer.";

  const DISCLAIMER_SHORT =
    "Not legal advice · not a claim filer · amenities are airline-specific commitments · never invent BTS code or $ hotel/meal · refunds ≠ amenities";

  const REFUND_SEPARATE =
    "Refund rights for cancel / significant change are SEPARATE — flightrights.gov / transportation.gov / Gate Rights (refund JTBD — not cloned here).";

  /** Teaching seeds — labeled. Not live airline scrapes. */
  const SEEDS = [
    {
      id: "mx-overnight-post",
      label: "Unscheduled MX · overnight · post-Oct19",
      sub: "Teaching · Amenity-unlikely (511(b) ten-event)",
      travelDate: "2026-10-20",
      causeId: "mx_unscheduled",
      overnight: "yes",
      noteLabel: "Unscheduled MX overnight · post-Oct19 teaching",
    },
    {
      id: "medical-post",
      label: "Medical emergency · post-Oct19",
      sub: "Teaching · Amenity-unlikely (511(b))",
      travelDate: "2026-10-25",
      causeId: "medical",
      overnight: "no",
      noteLabel: "Medical emergency teaching seed",
    },
    {
      id: "weather",
      label: "Weather / NAS",
      sub: "Teaching · Amenity-unlikely (uncontrollable framing)",
      travelDate: "2026-10-20",
      causeId: "weather_nas",
      overnight: "yes",
      noteLabel: "Weather overnight teaching seed",
    },
    {
      id: "mx-pre",
      label: "Pre-Oct19 MX",
      sub: "Teaching · Pre-rule · would be unlikely after",
      travelDate: "2026-09-13",
      causeId: "mx_unscheduled",
      overnight: "yes",
      noteLabel: "Pre-Oct19 MX teaching seed",
    },
    {
      id: "other-controllable",
      label: "Other controllable · post-Oct19",
      sub: "Teaching · Amenity-likely (still Air Carrier)",
      travelDate: "2026-10-22",
      causeId: "other_controllable",
      overnight: "yes",
      noteLabel: "Other controllable teaching seed",
    },
    {
      id: "empty-miss",
      label: "Empty / missing date",
      sub: "Teaching · honest miss · no invented Oct 19 math",
      travelDate: "",
      causeId: "mx_unscheduled",
      overnight: "yes",
      noteLabel: "Honest-miss teaching seed",
    },
  ];

  const $ = function (id) {
    return document.getElementById(id);
  };

  function parseISODate(s) {
    if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const parts = s.split("-").map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    if (
      d.getFullYear() !== parts[0] ||
      d.getMonth() !== parts[1] - 1 ||
      d.getDate() !== parts[2]
    ) {
      return null;
    }
    return d;
  }

  function fmtDate(d) {
    if (!(d instanceof Date) || isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function isoFromDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function todayISO() {
    return isoFromDate(new Date());
  }

  function daysBetween(a, b) {
    const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.round((ub - ua) / 86400000);
  }

  function isTen511b(causeId) {
    return TEN_511B_IDS.indexOf(causeId) !== -1;
  }

  function postRuleAmenity(cause) {
    if (!cause || cause.bucket === "unsure") return "unsure";
    if (cause.bucket === "511b") return "unlikely";
    if (cause.bucket === "uncontrollable") return "unlikely";
    if (cause.bucket === "controllable") return "likely";
    return "unsure";
  }

  function amenityMeta(status, cause, overnight, daysToEffective, postWouldBe) {
    const overnightHint =
      overnight === "yes"
        ? " Overnight hotel is especially sensitive under 511(b) framing."
        : "";

    if (status === "pre") {
      const would =
        postWouldBe === "likely"
          ? "Amenity-likely"
          : postWouldBe === "unlikely"
            ? "Amenity-unlikely"
            : "Unsure";
      return {
        status: "pre",
        pill: "Pre-rule",
        cls: "warn",
        giant: "Pre-rule",
        sub:
          "Before " +
          EFFECTIVE_LABEL +
          " · after effective, this cause maps to " +
          would,
        flag:
          "PRE-RULE · " +
          (daysToEffective === 1
            ? "1 day"
            : daysToEffective + " days") +
          " until " +
          EFFECTIVE_LABEL +
          " · after that date this cause would be " +
          would +
          "." +
          overnightHint,
      };
    }
    if (status === "likely") {
      return {
        status: "likely",
        pill: "Amenity-likely",
        cls: "ok",
        giant: "Amenity-likely",
        sub: "Still framed as Air Carrier controllable · airline-specific commitments",
        flag:
          "AMENITY-LIKELY · cause is outside the ten 511(b) events and still “Air Carrier” controllable. Meals/hotels may still apply under the airline’s customer-service plan — commitments vary by carrier." +
          overnightHint,
      };
    }
    if (status === "unlikely") {
      const why =
        cause && cause.bucket === "511b"
          ? "Cause is one of the ten Section 511(b) events (excluded from Air Carrier)."
          : "Cause already framed as weather / NAS / security / late aircraft (uncontrollable).";
      return {
        status: "unlikely",
        pill: "Amenity-unlikely",
        cls: "danger",
        giant: "Amenity-unlikely",
        sub: why,
        flag:
          "AMENITY-UNLIKELY · " +
          why +
          " Meals/hotels typically hinge on controllable disruptions." +
          overnightHint,
      };
    }
    return {
      status: "unsure",
      pill: "Unsure",
      cls: "unsure",
      giant: "Unsure",
      sub: "Cause unclear — we will not invent a BTS code or amenity outcome",
      flag:
        "UNSURE · pick the closest cause chip to what the airline / gate agent said. We never invent the carrier’s official BTS code.",
    };
  }

  function bucketLabel(cause) {
    if (!cause) return "—";
    if (cause.bucket === "511b") return "511(b) ten-event";
    if (cause.bucket === "controllable") return "Other Air Carrier controllable";
    if (cause.bucket === "uncontrollable") return "Weather / NAS / security / late acft";
    return "Unsure";
  }

  function validate(input) {
    if (!parseISODate(input.travelDate)) {
      return "Pick a travel / view date — the Oct 19 gate needs it. We will not invent pre-rule vs post-effective math.";
    }
    if (!CAUSE_BY_ID[input.causeId]) {
      return "Pick a cause chip — we will not invent what the airline said caused the delay.";
    }
    return null;
  }

  function compute(input) {
    const travelDate = parseISODate(input.travelDate);
    const cause = CAUSE_BY_ID[input.causeId] || CAUSE_BY_ID.unsure;
    const overnight = input.overnight === "yes" ? "yes" : "no";
    const effective = parseISODate(EFFECTIVE_ISO);
    const daysToEffective = travelDate && effective ? daysBetween(travelDate, effective) : null;
    const postWouldBe = postRuleAmenity(cause);

    let status = "unsure";
    if (cause.bucket === "unsure") {
      status = "unsure";
    } else if (travelDate && effective && daysToEffective > 0) {
      status = "pre";
    } else if (travelDate && effective && daysToEffective <= 0) {
      // date ≥ Oct 19
      status = postWouldBe === "likely" ? "likely" : postWouldBe === "unlikely" ? "unlikely" : "unsure";
    }

    const meta = amenityMeta(status, cause, overnight, daysToEffective, postWouldBe);

    let oct19Chip = "—";
    if (daysToEffective == null) {
      oct19Chip = EFFECTIVE_LABEL;
    } else if (daysToEffective > 0) {
      oct19Chip =
        daysToEffective === 1
          ? "1 day to effective"
          : daysToEffective + " days to effective";
    } else if (daysToEffective === 0) {
      oct19Chip = "Effective today";
    } else {
      oct19Chip = "Post-effective";
    }

    const eventStrip =
      cause.bucket === "511b"
        ? "511(b) ten-event membership: YES — “" +
          cause.short +
          "” is one of the ten statutory events excluded from Air Carrier (FR " +
          FR_DOC +
          ")."
        : cause.bucket === "controllable"
          ? "511(b) ten-event membership: NO — framed as other Air Carrier controllable (still amenity-hinge territory)."
          : cause.bucket === "uncontrollable"
            ? "511(b) ten-event membership: N/A — already weather / NAS / security / late aircraft (uncontrollable framing)."
            : "511(b) ten-event membership: unknown — cause chip is unsure.";

    const controllableStrip =
      "Meals / hotels hinge on *controllable* (Air Carrier) disruptions. Amenities are airline-specific commitments — never invent a $ hotel or meal amount.";

    const decoder =
      status === "pre"
        ? "Your travel/view date is before " +
          EFFECTIVE_LABEL +
          ". The Section 511(b) reclassification is not yet effective. After Oct 19, this cause would map to " +
          (postWouldBe === "likely"
            ? "Amenity-likely"
            : postWouldBe === "unlikely"
              ? "Amenity-unlikely"
              : "Unsure") +
          ". We do not invent the airline’s official BTS code."
        : status === "likely"
          ? "Date is on/after " +
            EFFECTIVE_LABEL +
            " and the cause is outside the ten 511(b) events — still “Air Carrier” controllable framing. Meal/hotel expectations may still apply under the carrier’s customer-service plan (airline-specific)."
          : status === "unlikely"
            ? "Date is on/after " +
              EFFECTIVE_LABEL +
              ". Under 511(b) / uncontrollable framing, meal and hotel amenities are typically not obligated when the disruption leaves “Air Carrier.” Confirm the airline’s posted commitments — this card does not file a claim."
            : "Cause status unsure. Paste the closest chip to what the gate agent said. We never invent a BTS code or amenity dollar amount.";

    const action = REFUND_SEPARATE;

    return {
      travelDate: travelDate,
      cause: cause,
      overnight: overnight,
      status: status,
      postWouldBe: postWouldBe,
      daysToEffective: daysToEffective,
      meta: meta,
      oct19Chip: oct19Chip,
      eventStrip: eventStrip,
      controllableStrip: controllableStrip,
      decoder: decoder,
      action: action,
      noteLabel: input.noteLabel || "",
      isTen511b: isTen511b(cause.id),
    };
  }

  function encodeHash(input) {
    const parts = [
      input.travelDate || "",
      input.causeId || "unsure",
      input.overnight || "no",
      input.noteLabel || "",
    ];
    const raw = parts.join("|");
    try {
      return "#p=" + btoa(unescape(encodeURIComponent(raw)));
    } catch (e) {
      return "#p=" + encodeURIComponent(raw);
    }
  }

  function decodeHash() {
    const raw = location.hash || "";
    if (!raw.startsWith("#p=")) return null;
    try {
      let decoded;
      try {
        decoded = decodeURIComponent(escape(atob(raw.slice(3))));
      } catch (e) {
        decoded = decodeURIComponent(raw.slice(3));
      }
      const parts = decoded.split("|");
      if (parts.length < 1) return null;
      return {
        travelDate: parts[0] || "",
        causeId: parts[1] || "unsure",
        overnight: parts[2] || "no",
        noteLabel: parts[3] || "",
      };
    } catch (e) {
      return null;
    }
  }

  function readInputs() {
    return {
      travelDate: ($("travelDate").value || "").trim(),
      causeId: $("causeSelect").value || "unsure",
      overnight: $("overnight").value || "no",
      noteLabel: ($("noteLabel").value || "").trim(),
    };
  }

  function applyInputs(p) {
    $("travelDate").value = p.travelDate || "";
    $("causeSelect").value = p.causeId || "unsure";
    $("overnight").value = p.overnight === "yes" ? "yes" : "no";
    $("noteLabel").value = p.noteLabel || "";
    syncCauseChipActive();
  }

  function syncCauseChipActive() {
    const id = $("causeSelect").value;
    const chips = document.querySelectorAll(".cause-chip");
    chips.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-cause") === id);
    });
  }

  function fillCauseSelect() {
    const sel = $("causeSelect");
    sel.innerHTML = "";
    CAUSES.forEach(function (c) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.label;
      sel.appendChild(opt);
    });
    sel.value = "unsure";
  }

  function renderCauseChips() {
    const box = $("causeChips");
    box.innerHTML = "";
    CAUSES.forEach(function (c) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cause-chip";
      btn.setAttribute("data-cause", c.id);
      btn.setAttribute("data-bucket", c.bucket);
      btn.textContent = c.short;
      btn.title = c.label;
      btn.addEventListener("click", function () {
        $("causeSelect").value = c.id;
        syncCauseChipActive();
      });
      box.appendChild(btn);
    });
    syncCauseChipActive();
  }

  function renderChips() {
    const box = $("seedChips");
    box.innerHTML = "";
    SEEDS.forEach(function (s) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "seed-chip";
      btn.setAttribute("role", "listitem");
      btn.innerHTML =
        s.label + '<span class="chip-sub">' + s.sub + "</span>";
      btn.addEventListener("click", function () {
        applyInputs(s);
        $("status").textContent = "Loaded seed: " + s.label;
        if (!s.travelDate) {
          $("cardSection").hidden = true;
          $("shareBox").hidden = true;
          $("status").textContent =
            "Honest miss: pick a travel / view date — we will not invent Oct 19 math. (Seed: " +
            s.label +
            ")";
          return;
        }
        renderCard();
      });
      box.appendChild(btn);
    });
  }

  function renderSources() {
    $("sourceLinks").innerHTML =
      'Cites: <a href="' +
      FR_URL +
      '" target="_blank" rel="noopener noreferrer">FR Sep 3 2026 (2026-18040)</a>' +
      '<a href="' +
      CROWELL_URL +
      '" target="_blank" rel="noopener noreferrer">Crowell Sep 3</a>' +
      '<a href="' +
      VFTW_URL +
      '" target="_blank" rel="noopener noreferrer">View from the Wing Sep 4</a>' +
      '<a href="' +
      SF_URL +
      '" target="_blank" rel="noopener noreferrer">Simple Flying Sep 5</a>' +
      '<a href="' +
      FLIGHTRIGHTS +
      '" target="_blank" rel="noopener noreferrer">flightrights.gov</a>' +
      '<a href="' +
      DOT_REFUNDS +
      '" target="_blank" rel="noopener noreferrer">DOT Refunds</a>';
  }

  function renderCard() {
    const input = readInputs();
    const err = validate(input);
    if (err) {
      $("cardSection").hidden = true;
      $("shareBox").hidden = true;
      $("status").textContent = err;
      return;
    }

    const c = compute(input);
    $("cardSection").hidden = false;
    $("shareBox").hidden = false;
    $("status").textContent = "Card ready — copy, share, or export PNG.";

    const metaBits = [];
    metaBits.push(c.cause.short);
    metaBits.push(overnightLabel(c.overnight));
    if (input.noteLabel) metaBits.push(input.noteLabel);
    $("cardMeta").textContent = metaBits.join(" · ");

    $("dlHeadline").textContent =
      c.status === "pre"
        ? "Before Oct 19 — which amenity bucket after?"
        : c.status === "likely"
          ? "Still amenity-likely after Oct 19?"
          : c.status === "unlikely"
            ? "Amenity-unlikely under 511(b) framing"
            : "Cause unclear — amenity status unsure";

    $("statusPill").textContent = c.meta.pill;
    $("statusPill").className = "verdict-k text-primary " + c.meta.cls;
    $("statusSub").textContent = c.meta.sub;

    $("amenityGiant").textContent = c.meta.giant;
    $("amenityGiant").className =
      "hero-amenity-badge text-primary " + c.meta.cls;
    $("amenitySub").textContent = c.meta.sub;

    $("statusFlag").textContent = c.meta.flag;
    $("statusFlag").className =
      "look-enroll-flag text-primary " + (c.meta.cls || "warn");

    $("controllableStrip").textContent = c.controllableStrip;
    $("eventStrip").textContent = c.eventStrip;

    $("rBucket").textContent = bucketLabel(c.cause);
    $("rOct19").textContent = c.oct19Chip;
    $("rOvernight").textContent = overnightLabel(c.overnight);
    $("rTravel").textContent = fmtDate(c.travelDate);

    $("decoderLine").textContent = c.decoder;
    $("actionLine").textContent = c.action;
    $("citeLine").textContent =
      "FR Sep 3 2026 (" +
      FR_DOC +
      ") · Crowell Sep 3 · VFTW Sep 4 · Simple Flying Sep 5 · effective " +
      EFFECTIVE_LABEL;

    const share = location.href.split("#")[0] + encodeHash(input);
    $("shareUrl").value = share;
    try {
      history.replaceState(null, "", encodeHash(input));
    } catch (e) {
      /* ignore */
    }
  }

  function overnightLabel(v) {
    return v === "yes" ? "Yes — overnight" : "No overnight";
  }

  function clearAll() {
    $("travelDate").value = todayISO();
    $("causeSelect").value = "unsure";
    $("overnight").value = "no";
    $("noteLabel").value = "";
    syncCauseChipActive();
    $("cardSection").hidden = true;
    $("shareBox").hidden = true;
    $("status").textContent = "Cleared.";
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch (e) {
      /* ignore */
    }
  }

  function copySummary() {
    const input = readInputs();
    const err = validate(input);
    if (err) {
      $("status").textContent = err;
      return;
    }
    const c = compute(input);
    const lines = [
      "511(b) Amenity Reality",
      c.meta.giant + " — " + c.meta.sub,
      "Cause: " + c.cause.label,
      "Bucket: " + bucketLabel(c.cause),
      "Travel/view: " + fmtDate(c.travelDate),
      "Oct 19 2026: " + c.oct19Chip,
      "Overnight: " + overnightLabel(c.overnight),
      c.eventStrip,
      c.controllableStrip,
      REFUND_SEPARATE,
      DISCLAIMER_SHORT,
      "Cites: FR Sep 3 2026 (2026-18040); Crowell Sep 3; View from the Wing Sep 4; Simple Flying Sep 5.",
    ];
    const text = lines.join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          $("status").textContent = "Summary copied.";
        },
        function () {
          $("status").textContent = "Copy failed — select share URL instead.";
        }
      );
    } else {
      $("status").textContent = "Clipboard unavailable.";
    }
  }

  function shareLink() {
    const input = readInputs();
    const err = validate(input);
    if (err) {
      $("status").textContent = err;
      return;
    }
    renderCard();
    const url = $("shareUrl").value;
    if (navigator.share) {
      navigator
        .share({
          title: "511(b) Amenity Reality",
          text: "Paste what they said caused it — still amenity-likely after Oct 19?",
          url: url,
        })
        .catch(function () {
          /* user cancel */
        });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        $("status").textContent = "Share link copied.";
      });
    }
  }

  function copyShare() {
    const url = $("shareUrl").value;
    if (!url) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        $("status").textContent = "Share URL copied.";
      });
    }
  }

  function exportPng() {
    const input = readInputs();
    const err = validate(input);
    if (err) {
      $("status").textContent = err;
      return;
    }
    const c = compute(input);
    const canvas = $("pngCanvas");
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.fillStyle = "#0b0f14";
    ctx.fillRect(0, 0, W, H);

    // accent bar
    ctx.fillStyle = "#2a5a7a";
    ctx.fillRect(0, 0, W, 8);

    ctx.fillStyle = "#7eb8e8";
    ctx.font = "700 22px IBM Plex Sans, sans-serif";
    ctx.fillText("511(b) Amenity Reality", 40, 52);

    ctx.fillStyle = "#8b9aab";
    ctx.font = "500 16px IBM Plex Mono, monospace";
    ctx.fillText(
      (c.cause.short || "") +
        " · " +
        overnightLabel(c.overnight) +
        " · " +
        fmtDate(c.travelDate),
      40,
      82
    );

    // Giant badge
    const badgeColor =
      c.meta.cls === "ok"
        ? "#3ecf8e"
        : c.meta.cls === "danger"
          ? "#f07178"
          : c.meta.cls === "warn"
            ? "#f0b429"
            : "#8b9aab";
    ctx.fillStyle = badgeColor;
    ctx.font = "700 64px IBM Plex Sans, sans-serif";
    ctx.fillText(c.meta.giant, 40, 170);

    ctx.fillStyle = "#e8eef4";
    ctx.font = "500 20px IBM Plex Sans, sans-serif";
    wrapText(ctx, c.meta.sub, 40, 210, W - 80, 28);

    // under-hero status flag (Pre-rule countdown / amenity restatement — text, not color-only)
    ctx.fillStyle = "#1a222c";
    roundRect(ctx, 40, 250, W - 80, 72, 10);
    ctx.fill();
    ctx.fillStyle = badgeColor;
    ctx.font = "600 16px IBM Plex Sans, sans-serif";
    wrapText(ctx, c.meta.flag, 56, 278, W - 112, 22);

    // strips
    ctx.fillStyle = "#121820";
    roundRect(ctx, 40, 340, W - 80, 100, 12);
    ctx.fill();
    ctx.fillStyle = "#e8eef4";
    ctx.font = "600 18px IBM Plex Sans, sans-serif";
    wrapText(
      ctx,
      "Meals / hotels hinge on controllable (Air Carrier).",
      56,
      378,
      W - 112,
      24
    );
    ctx.fillStyle = "#8b9aab";
    ctx.font = "500 15px IBM Plex Sans, sans-serif";
    wrapText(ctx, c.eventStrip, 56, 410, W - 112, 22);

    // chips row
    const chipY = 470;
    drawChip(ctx, 40, chipY, "Bucket: " + bucketLabel(c.cause));
    drawChip(ctx, 40, chipY + 48, "Oct 19: " + c.oct19Chip);
    drawChip(ctx, 40, chipY + 96, "Overnight: " + overnightLabel(c.overnight));

    ctx.fillStyle = "#e8eef4";
    ctx.font = "500 16px IBM Plex Sans, sans-serif";
    wrapText(ctx, c.decoder, 40, 630, W - 80, 24);

    // refund ≠ amenities
    ctx.fillStyle = "#f0b429";
    ctx.font = "600 16px IBM Plex Sans, sans-serif";
    wrapText(ctx, REFUND_SEPARATE, 40, 760, W - 80, 22);

    ctx.fillStyle = "#8b9aab";
    ctx.font = "500 14px IBM Plex Sans, sans-serif";
    wrapText(ctx, DISCLAIMER_SHORT, 40, 860, W - 80, 20);

    ctx.fillStyle = "#5a6a7a";
    ctx.font = "500 13px IBM Plex Mono, monospace";
    wrapText(
      ctx,
      "FR Sep 3 2026 (2026-18040) · Crowell Sep 3 · VFTW Sep 4 · Simple Flying Sep 5 · effective " +
        EFFECTIVE_LABEL,
      40,
      960,
      W - 80,
      18
    );

    ctx.fillStyle = "#3a4a5a";
    ctx.font = "500 12px IBM Plex Sans, sans-serif";
    ctx.fillText(
      "Not legal advice · not a claim filer · amenities are airline-specific commitments",
      40,
      H - 40
    );

    canvas.toBlob(function (blob) {
      if (!blob) {
        $("status").textContent = "PNG export failed.";
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download =
        "amenity-511b-reality-" +
        (c.status || "unsure") +
        "-" +
        (input.travelDate || "date") +
        ".png";
      a.click();
      URL.revokeObjectURL(a.href);
      $("status").textContent = "PNG downloaded.";
    });
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || "").split(/\s+/);
    let line = "";
    let yy = y;
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, yy);
        line = words[i];
        yy += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, yy);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawChip(ctx, x, y, label) {
    ctx.fillStyle = "#1a222c";
    const w = Math.min(820, ctx.measureText(label).width + 36);
    roundRect(ctx, x, y, Math.max(220, w), 36, 8);
    ctx.fill();
    ctx.fillStyle = "#e8eef4";
    ctx.font = "600 15px IBM Plex Sans, sans-serif";
    ctx.fillText(label, x + 14, y + 24);
  }

  function bind() {
    if (!$("travelDate").value) $("travelDate").value = todayISO();
    fillCauseSelect();
    renderCauseChips();
    renderChips();
    renderSources();

    $("causeSelect").addEventListener("change", syncCauseChipActive);
    $("cardBtn").addEventListener("click", renderCard);
    $("clearBtn").addEventListener("click", clearAll);
    $("copySummary").addEventListener("click", copySummary);
    $("shareBtn").addEventListener("click", shareLink);
    $("copyShare").addEventListener("click", copyShare);
    $("pngBtn").addEventListener("click", exportPng);

    window.addEventListener("hashchange", function () {
      const p = decodeHash();
      if (p) {
        applyInputs(p);
        renderCard();
      }
    });

    const fromHash = decodeHash();
    if (fromHash) {
      applyInputs(fromHash);
      renderCard();
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bind);
    } else {
      bind();
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      SEEDS: SEEDS,
      CAUSES: CAUSES,
      TEN_511B_IDS: TEN_511B_IDS,
      EFFECTIVE_ISO: EFFECTIVE_ISO,
      EFFECTIVE_LABEL: EFFECTIVE_LABEL,
      FR_DOC: FR_DOC,
      parseISODate: parseISODate,
      daysBetween: daysBetween,
      isTen511b: isTen511b,
      postRuleAmenity: postRuleAmenity,
      validate: validate,
      compute: compute,
      fmtDate: fmtDate,
      DISCLAIMER_SHORT: DISCLAIMER_SHORT,
      REFUND_SEPARATE: REFUND_SEPARATE,
      CITE_ONE_LINER: CITE_ONE_LINER,
    };
  }
})();
