import { useState } from "react";

const MEALS = ["Frühstück", "Mittagessen", "Abendessen", "Snack"];

const SYMPTOM_CATEGORIES = [
  {
    id: "digestion",
    label: "Verdauung",
    icon: "🫁",
    symptoms: ["Übelkeit", "Blähungen", "Völlegefühl", "Bauchschmerzen", "Durchfall", "Verstopfung", "Sodbrennen"],
  },
  {
    id: "energy",
    label: "Energie & Müdigkeit",
    icon: "⚡",
    symptoms: ["Morgenmüdigkeit", "Nachmittagstief", "Erschöpfung nach dem Essen", "Antriebslosigkeit", "Konzentrationsprobleme"],
  },
  {
    id: "psyche",
    label: "Psyche & Stimmung",
    icon: "🧠",
    symptoms: ["Gereiztheit", "Stimmungstiefs", "Innere Unruhe", "Ängstlichkeit", "Gedankenkarussell"],
  },
  {
    id: "sleep",
    label: "Schlaf",
    icon: "🌙",
    symptoms: ["Einschlafschwierigkeiten", "Durchschlafschwierigkeiten", "Nicht erholt aufgewacht", "Zu früh aufgewacht"],
  },
  {
    id: "pain",
    label: "Körperlich & Schmerzen",
    icon: "🩹",
    symptoms: ["Kopfschmerzen", "Gelenkschmerzen", "Muskelschmerzen", "Hautreaktionen", "Herzrasen / Herzklopfen"],
  },
];

const STOOL_TYPES = [
  { value: 1, label: "Typ 1", desc: "Einzelne harte Kügelchen" },
  { value: 2, label: "Typ 2", desc: "Klumpig, wurstartig" },
  { value: 3, label: "Typ 3", desc: "Wurst mit Rissen" },
  { value: 4, label: "Typ 4", desc: "Glatte Wurst (Ideal)" },
  { value: 5, label: "Typ 5", desc: "Weiche Klümpchen" },
  { value: 6, label: "Typ 6", desc: "Breiig, flockig" },
  { value: 7, label: "Typ 7", desc: "Wässrig, flüssig" },
];

function ScaleInput({ value, onChange, min = 0, max = 10, lowLabel, highLabel, color = "#2d6a4f" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, color: "#888", minWidth: 60 }}>{lowLabel}</span>
        <div style={{ display: "flex", gap: 4, flex: 1, justifyContent: "center" }}>
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((v) => (
            <button
              key={v}
              onClick={() => onChange(v)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: value === v ? `2px solid ${color}` : "1.5px solid #ddd",
                background: value === v ? color : "#fafafa",
                color: value === v ? "#fff" : "#666",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: value === v ? 700 : 400,
                transition: "all 0.15s",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "#888", minWidth: 60, textAlign: "right" }}>{highLabel}</span>
      </div>
    </div>
  );
}

function MealBlock({ meal, data, onChange }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e8f0eb",
      overflow: "hidden",
      marginBottom: 12,
    }}>
      <div style={{
        background: "#f0f7f3",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid #e8f0eb",
      }}>
        <span style={{ fontSize: 16 }}>
          {meal === "Frühstück" ? "🌅" : meal === "Mittagessen" ? "☀️" : meal === "Abendessen" ? "🌙" : "🍎"}
        </span>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: "#1a3d2b" }}>
          {meal}
        </span>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 6 }}>
            Was hast du gegessen?
          </label>
          <textarea
            value={data.food || ""}
            onChange={(e) => onChange({ ...data, food: e.target.value })}
            placeholder="z.B. Haferbrei mit Blaubeeren, gekochte Karotten, Hühnerbrühe…"
            style={{
              width: "100%",
              minHeight: 64,
              border: "1.5px solid #e0ebe5",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              color: "#2a2a2a",
              background: "#fafcfb",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 8 }}>
            Verträglichkeit (0 = sehr gut, 10 = sehr schlecht)
          </label>
          <ScaleInput
            value={data.tolerance}
            onChange={(v) => onChange({ ...data, tolerance: v })}
            lowLabel="sehr gut"
            highLabel="sehr schlecht"
          />
        </div>
        <div>
          <label style={{ fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 6 }}>
            Anmerkungen zur Mahlzeit
          </label>
          <input
            value={data.note || ""}
            onChange={(e) => onChange({ ...data, note: e.target.value })}
            placeholder="z.B. sofort Blähungen danach, gut vertragen…"
            style={{
              width: "100%",
              border: "1.5px solid #e0ebe5",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              color: "#2a2a2a",
              background: "#fafcfb",
              fontFamily: "inherit",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SymptomBlock({ category, data, onChange }) {
  const [open, setOpen] = useState(false);
  const activeCount = (data.symptoms || []).length;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e8f0eb",
      marginBottom: 10,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          background: activeCount > 0 ? "#f0f7f3" : "#fafcfb",
          border: "none",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderBottom: open ? "1px solid #e8f0eb" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{category.icon}</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 600, color: "#1a3d2b" }}>
            {category.label}
          </span>
          {activeCount > 0 && (
            <span style={{
              background: "#2d6a4f",
              color: "#fff",
              borderRadius: 20,
              fontSize: 11,
              padding: "1px 8px",
              fontWeight: 600,
            }}>
              {activeCount}
            </span>
          )}
        </div>
        <span style={{ color: "#2d6a4f", fontSize: 18, fontWeight: 300 }}>{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 10 }}>
              Welche Symptome hattest du heute?
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {category.symptoms.map((s) => {
                const active = (data.symptoms || []).includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => {
                      const current = data.symptoms || [];
                      onChange({
                        ...data,
                        symptoms: active ? current.filter((x) => x !== s) : [...current, s],
                      });
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: active ? "2px solid #2d6a4f" : "1.5px solid #d0e4d8",
                      background: active ? "#2d6a4f" : "#fafcfb",
                      color: active ? "#fff" : "#555",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: active ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {(data.symptoms || []).length > 0 && (
            <>
              <div>
                <label style={{ fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 8 }}>
                  Intensität (0 = kaum spürbar, 10 = sehr stark)
                </label>
                <ScaleInput
                  value={data.intensity}
                  onChange={(v) => onChange({ ...data, intensity: v })}
                  lowLabel="kaum"
                  highLabel="sehr stark"
                  color="#c05c3a"
                />
              </div>
              <div>
                <label style={{ fontSize: 12, color: "#666", fontWeight: 500, display: "block", marginBottom: 6 }}>
                  Weitere Notizen
                </label>
                <input
                  value={data.note || ""}
                  onChange={(e) => onChange({ ...data, note: e.target.value })}
                  placeholder="Wann genau? Im Zusammenhang mit einer Mahlzeit?"
                  style={{
                    width: "100%",
                    border: "1.5px solid #e0ebe5",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    color: "#2a2a2a",
                    background: "#fafcfb",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    outline: "none",
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const today = new Date().toLocaleDateString("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const [step, setStep] = useState(0); // 0=intro, 1=meals, 2=symptoms, 3=stool, 4=general, 5=summary
  const [meals, setMeals] = useState({});
  const [symptoms, setSymptoms] = useState({});
  const [stool, setStool] = useState({ type: null, frequency: null, note: "" });
  const [general, setGeneral] = useState({ water: "", wellbeing: null, stress: null, note: "", supplements: "" });
  const [submitted, setSubmitted] = useState(false);

  const steps = ["Einführung", "Mahlzeiten", "Symptome", "Stuhlgang", "Allgemein", "Zusammenfassung"];

  const progressPct = (step / (steps.length - 1)) * 100;

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f7f3 0%, #e8f3ec 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Lato', sans-serif",
        padding: 24,
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1a3d2b", marginBottom: 12 }}>
            Eintrag gespeichert
          </h2>
          <p style={{ color: "#555", lineHeight: 1.7, marginBottom: 24 }}>
            Danke! Dein Tagesprotokoll wurde erfasst. Sabine kann deine Einträge nun in der nächsten Konsultation mit dir besprechen.
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setMeals({}); setSymptoms({}); setStool({ type: null, frequency: null, note: "" }); setGeneral({ water: "", wellbeing: null, stress: null, note: "", supplements: "" }); }}
            style={{
              background: "#2d6a4f",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Neuer Eintrag
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f4f9f6 0%, #eaf3ee 100%)",
      fontFamily: "'Lato', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e0ebe5",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div className="ph-logo">
                prevention<span>.</span>health
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>Tagesprotokoll · {today}</div>
            </div>
            <div style={{ fontSize: 12, color: "#2d6a4f", fontWeight: 600 }}>
              {step + 1} / {steps.length}
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height: 3, background: "#e0ebe5", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #2d6a4f, #52b788)",
              borderRadius: 2,
              transition: "width 0.4s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {steps.map((s, i) => (
              <span key={s} style={{ fontSize: 10, color: i <= step ? "#2d6a4f" : "#bbb", fontWeight: i === step ? 700 : 400 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 100px" }}>

        {/* STEP 0: Intro */}
        {step === 0 && (
          <div>
            <div style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              border: "1px solid #e0ebe5",
              marginBottom: 20,
            }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "#1a3d2b", marginBottom: 12, lineHeight: 1.3 }}>
                Dein tägliches Ernährungs- & Befindlichkeitstagebuch
              </h1>
              <p style={{ color: "#555", lineHeight: 1.8, fontSize: 14, marginBottom: 16 }}>
                Dieses Protokoll hilft dir und Sabine, Muster zu erkennen — welche Mahlzeiten du gut verträgst, wann Symptome auftreten und wie sich dein Wohlbefinden entwickelt.
              </p>
              <div style={{ background: "#f0f7f3", borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <p style={{ color: "#2d6a4f", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Was dich erwartet:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: "🍽️", text: "Deine Mahlzeiten & Verträglichkeit eintragen" },
                    { icon: "🔍", text: "Symptome aus 5 Kategorien auswählen" },
                    { icon: "📊", text: "Stuhlgang dokumentieren (Bristol-Skala)" },
                    { icon: "💧", text: "Allgemeines Wohlbefinden & Stresslevel erfassen" },
                  ].map((item) => (
                    <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, color: "#444" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ color: "#888", fontSize: 12, lineHeight: 1.7 }}>
                Dauer: ca. 3–5 Minuten täglich. Am besten abends ausfüllen, wenn du den Tag überblickst.
              </p>
            </div>
          </div>
        )}

        {/* STEP 1: Meals */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", marginBottom: 6 }}>
              Deine heutigen Mahlzeiten
            </h2>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
              Trage ein, was du heute gegessen hast — und wie gut du es vertragen hast. Möglichst konkret, auch Mengen und Zubereitungsart helfen.
            </p>
            {MEALS.map((meal) => (
              <MealBlock
                key={meal}
                meal={meal}
                data={meals[meal] || {}}
                onChange={(d) => setMeals({ ...meals, [meal]: d })}
              />
            ))}
          </div>
        )}

        {/* STEP 2: Symptoms */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", marginBottom: 6 }}>
              Deine heutigen Symptome
            </h2>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
              Klicke auf eine Kategorie, um sie aufzuklappen. Wähle nur aus, was du heute tatsächlich wahrgenommen hast — auch leichte Symptome sind wichtig.
            </p>
            {SYMPTOM_CATEGORIES.map((cat) => (
              <SymptomBlock
                key={cat.id}
                category={cat}
                data={symptoms[cat.id] || {}}
                onChange={(d) => setSymptoms({ ...symptoms, [cat.id]: d })}
              />
            ))}
          </div>
        )}

        {/* STEP 3: Stool */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", marginBottom: 6 }}>
              Stuhlgang heute
            </h2>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
              Der Stuhlgang ist ein wichtiger Indikator für deine Darmgesundheit. Die Bristol-Skala hilft uns zu verstehen, wie dein Darm gerade arbeitet. Typ 3–4 ist ideal.
            </p>
            <div style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e8f0eb",
              padding: 20,
              marginBottom: 16,
            }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 14 }}>
                Stuhltyp heute (Bristol-Skala)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STOOL_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setStool({ ...stool, type: t.value })}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: stool.type === t.value ? "2px solid #2d6a4f" : "1.5px solid #e0ebe5",
                      background: stool.type === t.value ? "#f0f7f3" : "#fafcfb",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      minWidth: 50,
                      fontSize: 12,
                      fontWeight: 700,
                      color: stool.type === t.value ? "#2d6a4f" : "#888",
                    }}>
                      {t.label}
                    </span>
                    <span style={{ fontSize: 13, color: "#444" }}>{t.desc}</span>
                    {t.value === 4 && <span style={{ marginLeft: "auto", fontSize: 11, color: "#2d6a4f", fontWeight: 600 }}>✓ Ideal</span>}
                  </button>
                ))}
                <button
                  onClick={() => setStool({ ...stool, type: 0 })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: stool.type === 0 ? "2px solid #c05c3a" : "1.5px solid #e0ebe5",
                    background: stool.type === 0 ? "#fdf3f0" : "#fafcfb",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: stool.type === 0 ? "#c05c3a" : "#888", minWidth: 50 }}>Keiner</span>
                  <span style={{ fontSize: 13, color: "#444" }}>Heute kein Stuhlgang</span>
                </button>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 12 }}>
                Häufigkeit heute
              </label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["1×", "2×", "3×", "4× oder mehr"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStool({ ...stool, frequency: f })}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 20,
                      border: stool.frequency === f ? "2px solid #2d6a4f" : "1.5px solid #e0ebe5",
                      background: stool.frequency === f ? "#2d6a4f" : "#fafcfb",
                      color: stool.frequency === f ? "#fff" : "#555",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: stool.frequency === f ? 700 : 400,
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 8 }}>
                Besonderheiten
              </label>
              <input
                value={stool.note}
                onChange={(e) => setStool({ ...stool, note: e.target.value })}
                placeholder="z.B. Schleim, Blut, starke Krämpfe davor…"
                style={{
                  width: "100%",
                  border: "1.5px solid #e0ebe5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#2a2a2a",
                  background: "#fafcfb",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 4: General */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", marginBottom: 6 }}>
              Allgemeines Wohlbefinden
            </h2>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
              Wie war der Tag insgesamt? Diese Informationen helfen, Zusammenhänge zwischen Stress, Hydration und körperlichen Symptomen zu erkennen.
            </p>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 10 }}>
                Gesamtwohlbefinden heute (0 = sehr schlecht, 10 = sehr gut)
              </label>
              <ScaleInput
                value={general.wellbeing}
                onChange={(v) => setGeneral({ ...general, wellbeing: v })}
                lowLabel="sehr schlecht"
                highLabel="sehr gut"
                color="#52b788"
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 10 }}>
                Stresslevel heute (0 = entspannt, 10 = sehr gestresst)
              </label>
              <ScaleInput
                value={general.stress}
                onChange={(v) => setGeneral({ ...general, stress: v })}
                lowLabel="entspannt"
                highLabel="sehr gestresst"
                color="#c05c3a"
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 8 }}>
                Wassertrinkmenge heute
              </label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["< 1 Liter", "1–1,5 L", "1,5–2 L", "2–2,5 L", "> 2,5 L"].map((w) => (
                  <button
                    key={w}
                    onClick={() => setGeneral({ ...general, water: w })}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 20,
                      border: general.water === w ? "2px solid #2d6a4f" : "1.5px solid #e0ebe5",
                      background: general.water === w ? "#2d6a4f" : "#fafcfb",
                      color: general.water === w ? "#fff" : "#555",
                      fontSize: 12,
                      cursor: "pointer",
                      fontWeight: general.water === w ? 700 : 400,
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 8 }}>
                Heutige Supplemente / Medikamente eingenommen?
              </label>
              <input
                value={general.supplements}
                onChange={(e) => setGeneral({ ...general, supplements: e.target.value })}
                placeholder="z.B. Zink, Vitamin D, Probiotikum — oder: keine"
                style={{
                  width: "100%",
                  border: "1.5px solid #e0ebe5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#2a2a2a",
                  background: "#fafcfb",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20 }}>
              <label style={{ fontSize: 13, color: "#444", fontWeight: 600, display: "block", marginBottom: 8 }}>
                Freie Notizen für heute
              </label>
              <textarea
                value={general.note}
                onChange={(e) => setGeneral({ ...general, note: e.target.value })}
                placeholder="Etwas, das dir heute aufgefallen ist — emotional, körperlich, besondere Ereignisse…"
                style={{
                  width: "100%",
                  minHeight: 80,
                  border: "1.5px solid #e0ebe5",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#2a2a2a",
                  background: "#fafcfb",
                  resize: "vertical",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Summary */}
        {step === 5 && (
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: "#1a3d2b", marginBottom: 6 }}>
              Zusammenfassung
            </h2>
            <p style={{ color: "#777", fontSize: 13, marginBottom: 20 }}>
              Hier ist dein heutiges Protokoll auf einen Blick.
            </p>

            {/* Meals summary */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 14 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#1a3d2b", marginBottom: 12 }}>🍽️ Mahlzeiten</h3>
              {MEALS.map((meal) => {
                const d = meals[meal];
                if (!d?.food) return null;
                return (
                  <div key={meal} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#2d6a4f", marginBottom: 2 }}>{meal}</div>
                    <div style={{ fontSize: 13, color: "#444" }}>{d.food}</div>
                    {d.tolerance !== undefined && (
                      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Verträglichkeit: {d.tolerance}/10</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Symptoms summary */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 14 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#1a3d2b", marginBottom: 12 }}>🔍 Symptome</h3>
              {SYMPTOM_CATEGORIES.map((cat) => {
                const d = symptoms[cat.id];
                if (!d?.symptoms?.length) return null;
                return (
                  <div key={cat.id} style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2d6a4f" }}>{cat.label}: </span>
                    <span style={{ fontSize: 13, color: "#444" }}>{d.symptoms.join(", ")}</span>
                    {d.intensity !== undefined && <span style={{ fontSize: 12, color: "#888" }}> (Intensität: {d.intensity}/10)</span>}
                  </div>
                );
              })}
              {!Object.values(symptoms).some((d) => d?.symptoms?.length > 0) && (
                <p style={{ fontSize: 13, color: "#888" }}>Keine Symptome eingetragen.</p>
              )}
            </div>

            {/* General summary */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8f0eb", padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#1a3d2b", marginBottom: 12 }}>💧 Allgemein</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {general.wellbeing !== null && <div style={{ fontSize: 13, color: "#444" }}>Wohlbefinden: <strong>{general.wellbeing}/10</strong></div>}
                {general.stress !== null && <div style={{ fontSize: 13, color: "#444" }}>Stress: <strong>{general.stress}/10</strong></div>}
                {general.water && <div style={{ fontSize: 13, color: "#444" }}>Wasser: <strong>{general.water}</strong></div>}
                {stool.type !== null && <div style={{ fontSize: 13, color: "#444" }}>Stuhltyp: <strong>{stool.type === 0 ? "Keiner" : `Typ ${stool.type}`}</strong></div>}
              </div>
              {general.supplements && <div style={{ fontSize: 13, color: "#444", marginTop: 10 }}>Supplemente: {general.supplements}</div>}
              {general.note && <div style={{ fontSize: 13, color: "#555", marginTop: 10, fontStyle: "italic" }}>{general.note}</div>}
            </div>

            <button
              onClick={() => setSubmitted(true)}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #2d6a4f, #52b788)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px 28px",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.03em",
              }}
            >
              Protokoll abschließen ✓
            </button>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#fff",
        borderTop: "1px solid #e0ebe5",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto", width: "100%", display: "flex", gap: 12 }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                flex: 1,
                background: "#f0f7f3",
                color: "#2d6a4f",
                border: "1.5px solid #c8e0d4",
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              ← Zurück
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                flex: 2,
                background: "#2d6a4f",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Weiter →
            </button>
          )}
        </div>
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @font-face {
          font-family: 'Aileron';
          src: url('https://cdn.jsdelivr.net/gh/sursly/aileron@master/Aileron-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
        }
        .ph-logo {
          font-family: 'Aileron', 'Lato', sans-serif;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.01em;
          color: #1a3d2b;
          text-transform: lowercase;
        }
        .ph-logo span {
          color: #2d6a4f;
        }
      `}</style>
    </div>
  );
}
