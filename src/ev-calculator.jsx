import { useState, useMemo, useCallback } from "react";
import { Trash2, Plus, Zap, Fuel, Settings, ChevronDown, ChevronUp, BarChart3, PoundSterling } from "lucide-react";

const DEFAULT_CARS = [
  { id: 1,  name: "Lucid Air",                   type: "ev",     cityKwh: 13.0, motorwayKwh: 16.0, priceGBP: 69900,  rangeKm: 550 },
  { id: 2,  name: "Kia EV6",                     type: "ev",     cityKwh: 15.0, motorwayKwh: 19.0, priceGBP: 45575,  rangeKm: 400 },
  { id: 3,  name: "Hyundai Ioniq 5",             type: "ev",     cityKwh: 15.5, motorwayKwh: 20.0, priceGBP: 40000,  rangeKm: 370 },
  { id: 4,  name: "BMW iX (xDrive50)",           type: "ev",     cityKwh: 17.0, motorwayKwh: 22.0, priceGBP: 87000,  rangeKm: 430 },
  { id: 5,  name: "Genesis Electrified GV70",    type: "ev",     cityKwh: 17.5, motorwayKwh: 22.5, priceGBP: 65915,  rangeKm: 360 },
  { id: 6,  name: "Mercedes EQS SUV",            type: "ev",     cityKwh: 18.0, motorwayKwh: 23.5, priceGBP: 105000, rangeKm: 390 },
  { id: 7,  name: "BMW i7",                      type: "ev",     cityKwh: 18.5, motorwayKwh: 23.0, priceGBP: 105000, rangeKm: 520 },
  { id: 8,  name: "Kia EV9",                     type: "ev",     cityKwh: 18.0, motorwayKwh: 24.5, priceGBP: 64000,  rangeKm: 430 },
  { id: 9,  name: "Audi Q8 e-tron",              type: "ev",     cityKwh: 19.0, motorwayKwh: 24.0, priceGBP: 74000,  rangeKm: 380 },
  { id: 10, name: "Ford Focus 1.0 EcoBoost",     type: "petrol", cityL: 7.8,    motorwayL: 5.6,    priceGBP: 23500,  rangeKm: 600 },
  { id: 11, name: "Volvo EX30",                  type: "ev",     cityKwh: 12.2, motorwayKwh: 19.7, priceGBP: 33000,  rangeKm: 280 },
  { id: 12, name: "Volvo EX40",                  type: "ev",     cityKwh: 13.3, motorwayKwh: 22.1, priceGBP: 42000,  rangeKm: 350 },
  { id: 13, name: "Polestar 2",                  type: "ev",     cityKwh: 12.3, motorwayKwh: 18.9, priceGBP: 44950,  rangeKm: 430 },
  { id: 14, name: "Kia EV3 (Standard Range)",    type: "ev",     cityKwh: 13.5, motorwayKwh: 18.0, priceGBP: 32995,  rangeKm: 300 },
  { id: 15, name: "Kia EV3 (Long Range)",        type: "ev",     cityKwh: 14.0, motorwayKwh: 18.5, priceGBP: 37500,  rangeKm: 480 },
  { id: 16, name: "Kia EV5",                     type: "ev",     cityKwh: 16.0, motorwayKwh: 22.0, priceGBP: 39000,  rangeKm: 450 },
];

let nextId = 17;

export default function App() {
  const [cars, setCars] = useState(DEFAULT_CARS);
  const [elecPrice, setElecPrice] = useState(20.45);
  const [petrolPrice, setPetrolPrice] = useState(158);
  const [miles, setMiles] = useState(6000);
  const [citySplit, setCitySplit] = useState(70);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newCar, setNewCar] = useState({ name: "", type: "ev", cityKwh: 18, motorwayKwh: 22, cityL: 7, motorwayL: 5.5 });

  const totalKm = miles * 1.60934;
  const cityKm = totalKm * (citySplit / 100);
  const mwayKm = totalKm * ((100 - citySplit) / 100);
  const cityBlocks = cityKm / 100;
  const mwayBlocks = mwayKm / 100;

  const results = useMemo(() => {
    return cars.map(car => {
      let cityCost, mwayCost, total;
      if (car.type === "ev") {
        const cityKwh = car.cityKwh * cityBlocks;
        const mwayKwh = car.motorwayKwh * mwayBlocks;
        cityCost = cityKwh * (elecPrice / 100);
        mwayCost = mwayKwh * (elecPrice / 100);
      } else {
        const cityL = car.cityL * cityBlocks;
        const mwayL = car.motorwayL * mwayBlocks;
        cityCost = cityL * (petrolPrice / 100);
        mwayCost = mwayL * (petrolPrice / 100);
      }
      total = cityCost + mwayCost;
      return { ...car, cityCost, mwayCost, total };
    }).sort((a, b) => a.total - b.total);
  }, [cars, elecPrice, petrolPrice, cityBlocks, mwayBlocks]);

  const petrolCars = results.filter(c => c.type === "petrol");
  const cheapestPetrol = petrolCars.length > 0 ? Math.min(...petrolCars.map(c => c.total)) : null;
  const maxCost = Math.max(...results.map(r => r.total), 1);

  const removeCar = useCallback((id) => {
    setCars(prev => prev.filter(c => c.id !== id));
  }, []);

  const addCar = useCallback(() => {
    if (!newCar.name.trim()) return;
    const car = {
      id: nextId++,
      name: newCar.name.trim(),
      type: newCar.type,
      ...(newCar.type === "ev"
        ? { cityKwh: parseFloat(newCar.cityKwh) || 18, motorwayKwh: parseFloat(newCar.motorwayKwh) || 22 }
        : { cityL: parseFloat(newCar.cityL) || 7, motorwayL: parseFloat(newCar.motorwayL) || 5.5 }
      ),
    };
    setCars(prev => [...prev, car]);
    setNewCar({ name: "", type: "ev", cityKwh: 18, motorwayKwh: 22, cityL: 7, motorwayL: 5.5 });
    setAddOpen(false);
  }, [newCar]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(170deg, #0a0e17 0%, #111827 50%, #0d1520 100%)",
      color: "#e2e6ef",
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      padding: "20px 12px 60px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 880, margin: "0 auto 16px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <BarChart3 size={22} color="#3ecf8e" />
          <h1 style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #3ecf8e, #f59e42)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}>EV vs Petrol Fuel Cost Calculator</h1>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#6b7a94", margin: 0 }}>
          Add vehicles, tweak the numbers, compare running costs instantly
        </p>
      </div>

      {/* Settings Panel */}
      <div style={{ maxWidth: 880, margin: "0 auto 12px" }}>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#181d28", border: "1px solid #262d3d", borderRadius: 8,
            color: "#8892a8", padding: "8px 14px", cursor: "pointer",
            fontSize: "0.75rem", fontWeight: 600, width: "100%",
            transition: "all 0.15s",
          }}
        >
          <Settings size={14} />
          Settings & Parameters
          <span style={{ marginLeft: "auto" }}>
            {settingsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </span>
        </button>

        {settingsOpen && (
          <div style={{
            background: "#181d28", border: "1px solid #262d3d", borderTop: "none",
            borderRadius: "0 0 8px 8px", padding: "14px 14px 16px",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12,
          }}>
            <InputField label="Electricity (p/kWh)" value={elecPrice} onChange={setElecPrice} icon={<Zap size={12} color="#3ecf8e" />} />
            <InputField label="Petrol (p/litre)" value={petrolPrice} onChange={setPetrolPrice} icon={<Fuel size={12} color="#e05c5c" />} />
            <InputField label="Annual miles" value={miles} onChange={setMiles} icon={<span style={{ fontSize: 11 }}>🛣️</span>} />
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.68rem", color: "#6b7a94", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <span style={{ fontSize: 11 }}>🏙️</span> City driving: {citySplit}%
              </label>
              <input
                type="range" min={0} max={100} value={citySplit}
                onChange={e => setCitySplit(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#3ecf8e" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "#4a5568" }}>
                <span>City {citySplit}%</span>
                <span>Motorway {100 - citySplit}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ maxWidth: 880, margin: "0 auto 14px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Stat label="Total distance" value={`${miles.toLocaleString()} mi`} sub={`${Math.round(totalKm).toLocaleString()} km`} />
        <Stat label="City" value={`${Math.round(cityKm).toLocaleString()} km`} sub={`${citySplit}%`} />
        <Stat label="Motorway" value={`${Math.round(mwayKm).toLocaleString()} km`} sub={`${100 - citySplit}%`} />
        <Stat label="Vehicles" value={cars.length} sub={`${cars.filter(c=>c.type==='ev').length} EV / ${cars.filter(c=>c.type==='petrol').length} Petrol`} />
      </div>

      {/* Results Table */}
      <div style={{
        maxWidth: 880, margin: "0 auto 12px",
        borderRadius: 10, border: "1px solid #262d3d",
        background: "#181d28", overflow: "hidden",
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem", minWidth: 620 }}>
            <thead>
              <tr>
                {["Vehicle", "Price", "Range", "City Cost", "Motorway Cost", "Year Total", "vs Cheapest Petrol", ""].map((h, i) => (
                  <th key={i} style={{
                    background: "#1e2536", padding: "10px 8px",
                    textAlign: i === 0 ? "left" : "center",
                    paddingLeft: i === 0 ? 14 : 8,
                    borderBottom: "2px solid #262d3d",
                    fontSize: "0.66rem", textTransform: "uppercase",
                    letterSpacing: "0.5px", color: "#6b7a94", fontWeight: 600,
                    position: "sticky", top: 0, zIndex: 2,
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((car, idx) => {
                const isPetrol = car.type === "petrol";
                const saving = cheapestPetrol !== null ? cheapestPetrol - car.total : 0;
                const barWidth = (car.total / maxCost) * 100;

                return (
                  <tr key={car.id} style={{
                    borderBottom: "1px solid #262d3d",
                    background: isPetrol ? "rgba(224,92,92,0.05)" : "transparent",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = isPetrol ? "rgba(224,92,92,0.08)" : "#1e2536"}
                  onMouseLeave={e => e.currentTarget.style.background = isPetrol ? "rgba(224,92,92,0.05)" : "transparent"}
                  >
                    <td style={{ padding: "10px 8px 10px 14px", fontWeight: 600, fontSize: "0.78rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 18, height: 18, borderRadius: 4, fontSize: "0.6rem", fontWeight: 700,
                          background: isPetrol ? "rgba(224,92,92,0.15)" : "rgba(62,207,142,0.12)",
                          color: isPetrol ? "#e05c5c" : "#3ecf8e",
                          flexShrink: 0,
                        }}>{idx + 1}</span>
                        <span style={{ color: isPetrol ? "#e05c5c" : "#e2e6ef" }}>{car.name}</span>
                        <span style={{
                          fontSize: "0.54rem", fontWeight: 700, padding: "1px 5px",
                          borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.5px",
                          background: isPetrol ? "rgba(224,92,92,0.12)" : "rgba(62,207,142,0.1)",
                          color: isPetrol ? "#e05c5c" : "#3ecf8e",
                          flexShrink: 0,
                        }}>{isPetrol ? "Petrol" : "EV"}</span>
                      </div>
                      {/* Mini bar */}
                      <div style={{ marginTop: 4, height: 3, borderRadius: 2, background: "#1a2030", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          width: `${barWidth}%`,
                          background: isPetrol ? "linear-gradient(90deg, #e05c5c, #c0392b)" : "linear-gradient(90deg, #3ecf8e, #2ba06a)",
                          transition: "width 0.4s ease",
                        }} />
                      </div>
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", color: "#a0adc0", whiteSpace: "nowrap" }}>
                      {car.priceGBP != null ? `~£${(car.priceGBP / 1000).toFixed(0)}k` : "—"}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", color: "#a0adc0", whiteSpace: "nowrap" }}>
                      {car.rangeKm != null ? `~${car.rangeKm}km` : "—"}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", color: "#a0adc0" }}>
                      £{car.cityCost.toFixed(0)}
                    </td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", color: "#a0adc0" }}>
                      £{car.mwayCost.toFixed(0)}
                    </td>
                    <td style={{
                      padding: "10px 8px", textAlign: "center", fontFamily: "monospace",
                      fontWeight: 700, fontSize: "0.84rem",
                      color: isPetrol ? "#e05c5c" : "#3ecf8e",
                    }}>
                      £{Math.round(car.total).toLocaleString()}
                    </td>
                    <td style={{
                      padding: "10px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 600,
                      color: isPetrol ? "#5a6378" : (saving > 0 ? "#3ecf8e" : "#f59e42"),
                    }}>
                      {isPetrol ? "—" : (
                        cheapestPetrol !== null
                          ? (saving > 0 ? `Save £${Math.round(saving)}` : `+£${Math.round(Math.abs(saving))}`)
                          : "No petrol car"
                      )}
                    </td>
                    <td style={{ padding: "10px 6px", textAlign: "center", width: 36 }}>
                      <button
                        onClick={() => removeCar(car.id)}
                        style={{
                          background: "transparent", border: "none", cursor: "pointer",
                          color: "#3d4760", padding: 2, borderRadius: 4,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#e05c5c"}
                        onMouseLeave={e => e.currentTarget.style.color = "#3d4760"}
                        title="Remove vehicle"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Car Panel */}
      <div style={{ maxWidth: 880, margin: "0 auto 16px" }}>
        {!addOpen ? (
          <button
            onClick={() => setAddOpen(true)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              background: "rgba(62,207,142,0.08)", border: "1px dashed #3ecf8e40",
              borderRadius: 8, color: "#3ecf8e", padding: "10px 14px", cursor: "pointer",
              fontSize: "0.76rem", fontWeight: 600, width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(62,207,142,0.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(62,207,142,0.08)"; }}
          >
            <Plus size={15} /> Add a vehicle
          </button>
        ) : (
          <div style={{
            background: "#181d28", border: "1px solid #3ecf8e40",
            borderRadius: 10, padding: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Plus size={14} color="#3ecf8e" />
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#3ecf8e" }}>Add Vehicle</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
              <div>
                <label style={labelStyle}>Vehicle name</label>
                <input
                  value={newCar.name}
                  onChange={e => setNewCar({ ...newCar, name: e.target.value })}
                  placeholder="e.g. Tesla Model 3"
                  style={inputStyle}
                  onKeyDown={e => e.key === 'Enter' && addCar()}
                />
              </div>
              <div>
                <label style={labelStyle}>Fuel type</label>
                <select
                  value={newCar.type}
                  onChange={e => setNewCar({ ...newCar, type: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="ev">Electric (EV)</option>
                  <option value="petrol">Petrol</option>
                </select>
              </div>
              {newCar.type === "ev" ? (
                <>
                  <div>
                    <label style={labelStyle}>City (kWh/100km)</label>
                    <input
                      type="number" step="0.5" value={newCar.cityKwh}
                      onChange={e => setNewCar({ ...newCar, cityKwh: e.target.value })}
                      style={inputStyle}
                      onKeyDown={e => e.key === 'Enter' && addCar()}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Motorway (kWh/100km)</label>
                    <input
                      type="number" step="0.5" value={newCar.motorwayKwh}
                      onChange={e => setNewCar({ ...newCar, motorwayKwh: e.target.value })}
                      style={inputStyle}
                      onKeyDown={e => e.key === 'Enter' && addCar()}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={labelStyle}>City (L/100km)</label>
                    <input
                      type="number" step="0.1" value={newCar.cityL}
                      onChange={e => setNewCar({ ...newCar, cityL: e.target.value })}
                      style={inputStyle}
                      onKeyDown={e => e.key === 'Enter' && addCar()}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Motorway (L/100km)</label>
                    <input
                      type="number" step="0.1" value={newCar.motorwayL}
                      onChange={e => setNewCar({ ...newCar, motorwayL: e.target.value })}
                      style={inputStyle}
                      onKeyDown={e => e.key === 'Enter' && addCar()}
                    />
                  </div>
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button onClick={addCar} style={{
                background: "#3ecf8e", color: "#0a0e17", border: "none", borderRadius: 6,
                padding: "8px 18px", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#4de09f"}
              onMouseLeave={e => e.currentTarget.style.background = "#3ecf8e"}
              >Add Vehicle</button>
              <button onClick={() => setAddOpen(false)} style={{
                background: "transparent", color: "#6b7a94", border: "1px solid #262d3d",
                borderRadius: 6, padding: "8px 14px", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div style={{
        maxWidth: 880, margin: "0 auto",
        fontSize: "0.65rem", color: "#3d4760", lineHeight: 1.6, padding: "0 4px",
      }}>
        Consumption figures are real-world estimates and will vary with driving style, temperature, tyre pressure, and payload.
        Costs are calculated based on home charging rates. Public rapid chargers typically cost 3–4× more per kWh.
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, icon }) {
  return (
    <div>
      <label style={{ display: "flex", alignItems: "center", gap: 4, ...labelStyle }}>
        {icon} {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={inputStyle}
      />
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div style={{
      flex: "1 1 100px", background: "#181d28", border: "1px solid #262d3d",
      borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 90,
    }}>
      <div style={{ fontSize: "0.62rem", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#e2e6ef", fontFamily: "monospace", marginTop: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.6rem", color: "#4a5568", marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

const labelStyle = {
  fontSize: "0.66rem", color: "#6b7a94", marginBottom: 4, fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.5px", display: "block",
};

const inputStyle = {
  width: "100%", background: "#111827", border: "1px solid #262d3d",
  borderRadius: 6, color: "#e2e6ef", padding: "7px 10px",
  fontSize: "0.8rem", fontFamily: "monospace", outline: "none",
};
