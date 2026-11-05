import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CarFront,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Headphones,
  Home,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Navigation,
  Phone,
  Plane,
  Plus,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  WalletCards,
  X,
  Zap,
} from "lucide-react"

type Driver = {
  id: number
  name: string
  initials: string
  rating: string
  rides: number
  car: string
  plate: string
  eta: number
  distance: string
  fare: number
  color: string
}

const drivers: Driver[] = [
  {
    id: 1,
    name: "Raj 'Raj' Kumar",
    initials: "RK",
    rating: "4.96",
    rides: 840,
    car: "White Swift Dzire",
    plate: "KA 01 MJ 4821",
    eta: 3,
    distance: "0.8 km",
    fare: 420,
    color: "#f6c817",
  },
  {
    id: 2,
    name: "Suresh M.",
    initials: "SM",
    rating: "4.88",
    rides: 612,
    car: "Grey Hyundai Aura",
    plate: "KA 05 NP 1134",
    eta: 5,
    distance: "1.4 km",
    fare: 400,
    color: "#84c9a7",
  },
  {
    id: 3,
    name: "Ameen K.",
    initials: "AK",
    rating: "4.91",
    rides: 735,
    car: "Blue Maruti Baleno",
    plate: "KA 03 HM 7742",
    eta: 7,
    distance: "2.1 km",
    fare: 440,
    color: "#8ca9d6",
  },
]

const savedPlaces = [
  { icon: Home, label: "Home", detail: "Koramangala 4th Block" },
  { icon: BriefcaseBusiness, label: "Work", detail: "Indiranagar 100ft Road" },
  { icon: Plane, label: "Airport", detail: "Kempegowda Airport" },
]

type View = "ride" | "trips" | "passes" | "account"
type RideStage = "plan" | "offers" | "confirmed"
type Role = "rider" | "driver"
type VehicleType = "mini" | "sedan"
type AccountPanel = "details" | "safety" | "settings"

type ProfileData = {
  name: string
  phone: string
  email: string
  city: string
  photo?: string
  emergencyName: string
  emergencyPhone: string
  vehicle?: string
  plate?: string
}

type AppPreferences = {
  rideAlerts: boolean
  messages: boolean
  safetyAlerts: boolean
  sound: boolean
  language: string
  autoAccept: boolean
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="logo" aria-label="NearDrive home">
      <span className="logo-mark">
        <Navigation size={compact ? 14 : 17} strokeWidth={3} />
      </span>
      <span>
        <b>NearDrive</b>
        {!compact && <small>MOVE LOCAL</small>}
      </span>
    </div>
  )
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="status-pill">
      <span className="status-dot" />
      {children}
    </span>
  )
}

function MapCanvas({
  stage,
  onDriver,
}: {
  stage: RideStage
  onDriver: (driver: Driver) => void
}) {
  return (
    <div className="map-canvas">
      <div className="map-grid" />
      <div className="water water-one" />
      <div className="water water-two" />
      <div className="park park-one">Cubbon Park</div>
      <div className="park park-two" />
      <div className="road road-a" />
      <div className="road road-b" />
      <div className="road road-c" />
      <div className="road road-d" />
      <span className="map-label label-one">Indiranagar</span>
      <span className="map-label label-two">Koramangala</span>
      <span className="map-label label-three">MG Road</span>

      {stage === "confirmed" ? (
        <>
          <div className="route-line" />
          <div className="map-pin pickup-pin">
            <MapPin size={18} fill="currentColor" />
          </div>
          <div className="map-pin drop-pin">
            <Navigation size={17} fill="currentColor" />
          </div>
          <button
            className="car-marker confirmed-car"
            onClick={() => onDriver(drivers[0])}
          >
            <CarFront size={18} />
            <span>3 min</span>
          </button>
        </>
      ) : (
        <>
          <button
            className="car-marker car-one"
            onClick={() => onDriver(drivers[0])}
          >
            <CarFront size={17} />
            <span>3m</span>
          </button>
          <button
            className="car-marker car-two"
            onClick={() => onDriver(drivers[1])}
          >
            <CarFront size={17} />
            <span>5m</span>
          </button>
          <button
            className="car-marker car-three"
            onClick={() => onDriver(drivers[2])}
          >
            <CarFront size={17} />
            <span>7m</span>
          </button>
        </>
      )}

      <button className="locate-button" aria-label="Use my current location">
        <LocateFixed size={19} />
      </button>
      <div className="map-legend">
        <span>
          <span className="legend-live" />{" "}
          {stage === "confirmed" ? "Driver en route" : "5 drivers nearby"}
        </span>
        <span>Updated now</span>
      </div>
    </div>
  )
}

function DriverCard({
  driver,
  selected,
  onSelect,
}: {
  driver: Driver
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={`driver-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <span className="driver-avatar" style={{ background: driver.color }}>
        {driver.initials}
        <i />
      </span>
      <span className="driver-info">
        <span className="driver-name">
          {driver.name} <BadgeCheck size={15} fill="#16875f" />
        </span>
        <span>
          {driver.car} · {driver.plate}
        </span>
        <span className="driver-meta">
          <b>
            <Star size={12} fill="#f6c817" /> {driver.rating}
          </b>
          <span>{driver.rides} rides</span>
          <span>{driver.distance} away</span>
        </span>
      </span>
      <span className="driver-price">
        <small>{driver.eta} min</small>
        <b>₹{driver.fare}</b>
      </span>
    </button>
  )
}

function PassModal({
  role,
  onClose,
  onActivate,
}: {
  role: Role
  onClose: () => void
  onActivate: (name: string) => void
}) {
  const plans =
    role === "rider"
      ? [
          {
            name: "Day Explorer",
            price: "₹29",
            note: "24 hours",
            featured: false,
          },
          { name: "Travel Week", price: "₹99", note: "7 days", featured: true },
          {
            name: "Local Month",
            price: "₹249",
            note: "30 days",
            featured: false,
          },
        ]
      : [
          {
            name: "Single Shift",
            price: "₹49",
            note: "24 hours",
            featured: false,
          },
          { name: "Weekly Pro", price: "₹249", note: "7 days", featured: true },
          {
            name: "Monthly Partner",
            price: "₹699",
            note: "30 days",
            featured: false,
          },
        ]

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a subscription pass"
    >
      <div className="pass-modal">
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <div className="modal-icon">
          <Sparkles size={23} />
        </div>
        <p className="eyebrow">
          {role === "rider" ? "TOURIST PASSES" : "DRIVER PARTNER PASSES"}
        </p>
        <h2>Stay connected, your way</h2>
        <p className="modal-lead">
          {role === "rider"
            ? "Unlock direct driver contact and unlimited local ride requests."
            : "Get unlimited nearby ride requests with zero commission on fares."}
        </p>
        <div className="plan-grid">
          {plans.map((plan) => (
            <button
              key={plan.name}
              className={`plan-card ${plan.featured ? "featured" : ""}`}
              onClick={() => onActivate(plan.name)}
            >
              {plan.featured && (
                <span className="popular-tag">MOST POPULAR</span>
              )}
              <strong>{plan.name}</strong>
              <span className="profile-edit-info">
                <b>{plan.price}</b> / {plan.note}
              </span>
              <small>
                <Check size={13} /> Unlimited matching
              </small>
              <small>
                <Check size={13} /> Direct contact access
              </small>
            </button>
          ))}
        </div>
        <div className="transparency-note">
          <ShieldCheck size={18} />
          <span>
            <b>NearDrive only charges for access.</b> Ride fares are settled
            directly with your driver.
          </span>
        </div>
      </div>
    </div>
  )
}

function AccountSheet({
  panel,
  role,
  profile,
  preferences,
  onProfileChange,
  onPreferencesChange,
  onClose,
}: {
  panel: AccountPanel
  role: Role
  profile: ProfileData
  preferences: AppPreferences
  onProfileChange: (profile: ProfileData) => void
  onPreferencesChange: (preferences: AppPreferences) => void
  onClose: () => void
}) {
  const title =
    panel === "details"
      ? "Personal details"
      : panel === "safety"
        ? "Safety center"
        : "App settings"

  function updateProfile(field: keyof ProfileData, value: string) {
    onProfileChange({ ...profile, [field]: value })
  }

  function togglePreference(field: keyof AppPreferences) {
    const value = preferences[field]
    if (typeof value === "boolean") {
      onPreferencesChange({ ...preferences, [field]: !value })
    }
  }

  function handlePhoto(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onProfileChange({ ...profile, photo: reader.result })
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <section className="account-sheet">
        <header className="sheet-header">
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <ArrowLeft size={19} />
          </button>
          <div>
            <p className="eyebrow">
              {role === "rider" ? "TOURIST ACCOUNT" : "DRIVER PARTNER"}
            </p>
            <h2>{title}</h2>
          </div>
        </header>

        {panel === "details" && (
          <div className="settings-form">
            <div className="profile-edit-head">
              {profile.photo ? (
                <img
                  className="profile-large profile-photo"
                  src={profile.photo}
                  alt={`${profile.name} profile`}
                />
              ) : (
                <span className="profile-large">
                  {profile.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              )}
              <span>
                <b>{profile.name}</b>
                <small>
                  <BadgeCheck size={13} fill="#16875f" /> Verified{" "}
                  {role === "rider" ? "tourist" : "driver partner"}
                </small>
                <label className="photo-upload">
                  <span>{profile.photo ? "Change photo" : "Add photo"}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => handlePhoto(event.target.files?.[0])}
                  />
                </label>
              </span>
              {profile.photo && (
                <button
                  className="remove-photo"
                  onClick={() => onProfileChange({ ...profile, photo: "" })}
                >
                  Remove
                </button>
              )}
            </div>
            <label>
              <span>Full name</span>
              <input
                value={profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
              />
            </label>
            <label>
              <span>Mobile number</span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(event) => updateProfile("phone", event.target.value)}
              />
            </label>
            <label>
              <span>Email address</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) => updateProfile("email", event.target.value)}
              />
            </label>
            <label>
              <span>Home city</span>
              <input
                value={profile.city}
                onChange={(event) => updateProfile("city", event.target.value)}
              />
            </label>
            {role === "driver" && (
              <div className="split-fields">
                <label>
                  <span>Vehicle</span>
                  <input
                    value={profile.vehicle}
                    onChange={(event) =>
                      updateProfile("vehicle", event.target.value)
                    }
                  />
                </label>
                <label>
                  <span>Registration</span>
                  <input
                    value={profile.plate}
                    onChange={(event) =>
                      updateProfile("plate", event.target.value)
                    }
                  />
                </label>
              </div>
            )}
            <button className="primary-button wide" onClick={onClose}>
              Save changes <Check size={17} />
            </button>
          </div>
        )}

        {panel === "safety" && (
          <div className="safety-content">
            <div className="sos-card">
              <span className="sos-icon">SOS</span>
              <div>
                <p className="eyebrow">SAVED EMERGENCY CONTACT</p>
                <h3>{profile.emergencyName}</h3>
                <p>{profile.emergencyPhone}</p>
              </div>
            </div>
            <a
              className="emergency-call"
              href={`tel:${profile.emergencyPhone.replace(/\s/g, "")}`}
            >
              <Phone size={19} fill="currentColor" />
              Call {profile.emergencyName} now
            </a>
            <p className="call-warning">
              This uses your phone dialer. Use only when you need immediate
              help.
            </p>
            <div className="settings-form emergency-edit">
              <p className="form-section-title">Edit emergency contact</p>
              <label>
                <span>Contact name</span>
                <input
                  value={profile.emergencyName}
                  onChange={(event) =>
                    updateProfile("emergencyName", event.target.value)
                  }
                />
              </label>
              <label>
                <span>Emergency phone</span>
                <input
                  type="tel"
                  value={profile.emergencyPhone}
                  onChange={(event) =>
                    updateProfile("emergencyPhone", event.target.value)
                  }
                />
              </label>
            </div>
            <div className="safety-features">
              <div>
                <ShieldCheck size={18} />
                <span>
                  <b>Ride safety PIN</b>
                  <small>Required before every trip starts</small>
                </span>
              </div>
              <div>
                <Navigation size={18} />
                <span>
                  <b>Live trip sharing</b>
                  <small>Share route and driver details</small>
                </span>
              </div>
            </div>
            <button className="secondary-button wide-button" onClick={onClose}>
              Save emergency contact
            </button>
          </div>
        )}

        {panel === "settings" && (
          <div className="settings-content">
            <p className="form-section-title">Notifications</p>
            {[
              {
                key: "rideAlerts" as const,
                title: "Ride updates",
                copy: "Driver arrival and trip status",
              },
              {
                key: "messages" as const,
                title: "Messages",
                copy: "New chat and counter offers",
              },
              {
                key: "safetyAlerts" as const,
                title: "Safety alerts",
                copy: "PIN and live-sharing reminders",
              },
              {
                key: "sound" as const,
                title: "Sound & vibration",
                copy: "Play sounds for urgent updates",
              },
            ].map((setting) => (
              <button
                className="setting-toggle"
                key={setting.key}
                onClick={() => togglePreference(setting.key)}
              >
                <span>
                  <b>{setting.title}</b>
                  <small>{setting.copy}</small>
                </span>
                <i className={preferences[setting.key] ? "on" : ""}>
                  <b />
                </i>
              </button>
            ))}
            {role === "driver" && (
              <button
                className="setting-toggle"
                onClick={() => togglePreference("autoAccept")}
              >
                <span>
                  <b>Auto-accept matching fares</b>
                  <small>Accept rides at or above your minimum</small>
                </span>
                <i className={preferences.autoAccept ? "on" : ""}>
                  <b />
                </i>
              </button>
            )}
            <div className="settings-form">
              <p className="form-section-title">Language & region</p>
              <label>
                <span>App language</span>
                <select
                  value={preferences.language}
                  onChange={(event) =>
                    onPreferencesChange({
                      ...preferences,
                      language: event.target.value,
                    })
                  }
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Kannada</option>
                  <option>Tamil</option>
                </select>
              </label>
            </div>
            <button className="primary-button wide" onClick={onClose}>
              Save settings <Check size={17} />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

function DriverDashboard({
  activePass,
  onPass,
  onSwitch,
  onProfile,
}: {
  activePass: string
  onPass: () => void
  onSwitch: () => void
  onProfile: () => void
}) {
  const [online, setOnline] = useState(true)
  const [request, setRequest] = useState(true)
  const [earnings, setEarnings] = useState(1850)
  const [showTourist, setShowTourist] = useState(false)
  const [counterOpen, setCounterOpen] = useState(false)
  const [counterFare, setCounterFare] = useState(450)
  const [counterSent, setCounterSent] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [supportMessage, setSupportMessage] = useState("")
  const [supportSent, setSupportSent] = useState(false)

  function acceptRide() {
    setRequest(false)
    setEarnings((value) => value + (counterSent ? counterFare : 420))
  }

  function sendCounter() {
    setCounterSent(true)
    setCounterOpen(false)
  }

  return (
    <main className="driver-dashboard">
      <section className="driver-hero">
        <div>
          <p className="eyebrow">DRIVER PARTNER DESK</p>
          <h1>Good morning, Raj.</h1>
          <p>Own your fares. Keep every rupee you earn.</p>
        </div>
        <button
          className={`online-toggle ${online ? "on" : ""}`}
          onClick={() => setOnline(!online)}
        >
          <span>
            <i /> {online ? "You are online" : "You are offline"}
          </span>
          <b>{online ? "Go offline" : "Go online"}</b>
        </button>
      </section>

      <div className="driver-layout">
        <section className="driver-main">
          <div className="partner-card">
            <div className="partner-top">
              <span className="driver-avatar large">
                RK
                <i />
              </span>
              <div>
                <p className="eyebrow">PRO PARTNER · 4.96 RATING</p>
                <h2>
                  Raj 'Raj' Kumar <BadgeCheck size={18} fill="#16875f" />
                </h2>
                <p>White Swift Dzire · KA 01 MJ 4821</p>
              </div>
              <span className="zero-cut">
                0%<small>FARE CUT</small>
              </span>
            </div>
            <div className="active-pass-row">
              <ShieldCheck size={18} />
              <span>
                <b>{activePass || "Weekly Pro"} active</b>
                <small>Unlimited dispatches · 4d remaining</small>
              </span>
              <button onClick={onPass}>Manage</button>
            </div>
          </div>

          {request ? (
            <div className="request-card">
              <div className="request-alert">
                <span>
                  <Zap size={17} fill="currentColor" />
                </span>
                <div>
                  <b>New nearby request</b>
                  <small>Expires in 18 seconds</small>
                </div>
                <strong>₹420</strong>
              </div>
              <button
                className="rider-row"
                onClick={() => setShowTourist(!showTourist)}
                aria-expanded={showTourist}
              >
                <span className="rider-avatar">PS</span>
                <div>
                  <b>Priya Sharma</b>
                  <span>
                    <Star size={12} fill="#f6c817" /> 4.92 · Verified tourist
                  </span>
                </div>
                <span>{showTourist ? "Hide profile" : "Check tourist"}</span>
              </button>
              {showTourist && (
                <div className="tourist-profile">
                  <div className="tourist-verification">
                    <BadgeCheck size={18} fill="#16875f" />
                    <span>
                      <b>Identity verified</b>
                      <small>Phone and government ID checked</small>
                    </span>
                  </div>
                  <div className="tourist-stats">
                    <span>
                      <b>4.92</b>
                      <small>Rider rating</small>
                    </span>
                    <span>
                      <b>28</b>
                      <small>Completed trips</small>
                    </span>
                    <span>
                      <b>2</b>
                      <small>Bags</small>
                    </span>
                  </div>
                  <p>
                    <ShieldCheck size={13} /> No safety reports or payment
                    disputes
                  </p>
                </div>
              )}
              <div className="route-summary">
                <span className="route-nodes">
                  <i />
                  <b />
                  <i />
                </span>
                <span>
                  <b>Koramangala 4th Block</b>
                  <small>Pickup · 0.8 km away</small>
                  <b>Indiranagar 100ft Road</b>
                  <small>7.2 km · about 18 min</small>
                </span>
              </div>
              <div className="offer-box">
                <div>
                  <small>TOURIST OFFER</small>
                  <strong>₹420</strong>
                </div>
                <button
                  className="secondary-button"
                  onClick={() => setCounterOpen(!counterOpen)}
                >
                  {counterSent ? `Countered ₹${counterFare}` : "Counter price"}
                </button>
                <button className="primary-button" onClick={acceptRide}>
                  Accept ₹{counterSent ? counterFare : 420}{" "}
                  <ArrowRight size={17} />
                </button>
              </div>
              {counterOpen && (
                <div className="driver-counter">
                  <div>
                    <p className="eyebrow">YOUR COUNTER OFFER</p>
                    <span>Set a fair price for this trip</span>
                  </div>
                  <div className="driver-counter-controls">
                    <button
                      aria-label="Decrease counter price"
                      onClick={() =>
                        setCounterFare((fare) => Math.max(420, fare - 10))
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <strong>₹{counterFare}</strong>
                    <button
                      aria-label="Increase counter price"
                      onClick={() =>
                        setCounterFare((fare) => Math.min(600, fare + 10))
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="counter-quick-values">
                    {[440, 450, 470].map((fare) => (
                      <button
                        key={fare}
                        className={counterFare === fare ? "active" : ""}
                        onClick={() => setCounterFare(fare)}
                      >
                        ₹{fare}
                      </button>
                    ))}
                  </div>
                  <button className="primary-button" onClick={sendCounter}>
                    Send ₹{counterFare} counter offer <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {counterSent && !counterOpen && (
                <div className="counter-status">
                  <Clock3 size={14} />
                  <span>
                    <b>₹{counterFare} counter sent</b>
                    Waiting for Priya to respond
                  </span>
                  <button
                    onClick={() => {
                      setCounterSent(false)
                      setCounterOpen(true)
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
              <p className="settlement-copy">
                <WalletCards size={14} /> Rider pays you directly after arrival.
              </p>
            </div>
          ) : (
            <div className="accepted-card">
              <span>
                <Check size={26} />
              </span>
              <div>
                <h3>Ride accepted</h3>
                <p>Head to Koramangala 4th Block. Priya can now contact you.</p>
              </div>
              <button
                className="primary-button"
                onClick={() => setRequest(true)}
              >
                Open trip
              </button>
            </div>
          )}
        </section>

        <aside className="driver-stats">
          <div className="stat-card emphasis">
            <span>Today's earnings</span>
            <strong>₹{earnings.toLocaleString("en-IN")}</strong>
            <small>100% yours · settled directly</small>
          </div>
          <div className="stats-grid">
            <div>
              <strong>5</strong>
              <span>Trips</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>Acceptance</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>Rating</span>
            </div>
            <div>
              <strong>₹0</strong>
              <span>Commission</span>
            </div>
          </div>
          <button className="help-card" onClick={() => setShowSupport(true)}>
            <Headphones size={19} />
            <span>
              <b>Partner support</b>
              <small>Call, chat or email · available 24/7</small>
            </span>
            <ChevronRight size={18} />
          </button>
          <button className="switch-mode" onClick={onProfile}>
            <UserRound size={17} /> View and edit my details
          </button>
          <button className="switch-mode" onClick={onSwitch}>
            <UsersRound size={17} /> Switch to rider mode
          </button>
        </aside>
      </div>
      {showSupport && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <section className="support-sheet">
            <header className="sheet-header">
              <button
                className="icon-button"
                onClick={() => setShowSupport(false)}
                aria-label="Close support"
              >
                <ArrowLeft size={19} />
              </button>
              <div>
                <p className="eyebrow">NEARDRIVE PARTNER CARE</p>
                <h2>How can we help?</h2>
              </div>
            </header>
            <div className="support-status">
              <span className="status-dot" />
              <span>
                <b>Support team is online</b>
                <small>Typical response in under 2 minutes</small>
              </span>
            </div>
            <div className="support-actions">
              <a href="tel:180063272274">
                <Phone size={19} />
                <span>
                  <b>Call support</b>
                  <small>1800-NEAR-CAB</small>
                </span>
              </a>
              <a href="mailto:partners@neardrive.app">
                <MessageCircle size={19} />
                <span>
                  <b>Email team</b>
                  <small>Get a written reply</small>
                </span>
              </a>
            </div>
            <div className="support-topics">
              <p className="form-section-title">Choose a topic</p>
              <div>
                {["Ride issue", "Fare dispute", "Pass help", "Safety"].map(
                  (topic) => (
                    <button
                      key={topic}
                      onClick={() =>
                        setSupportMessage(
                          `I need help with a ${topic.toLowerCase()}. `,
                        )
                      }
                    >
                      {topic}
                    </button>
                  ),
                )}
              </div>
            </div>
            <label className="support-message">
              <span>Message the support team</span>
              <textarea
                value={supportMessage}
                onChange={(event) => {
                  setSupportMessage(event.target.value)
                  setSupportSent(false)
                }}
                placeholder="Describe what happened..."
              />
            </label>
            {supportSent ? (
              <div className="support-sent">
                <Check size={18} />
                <span>
                  <b>Message sent</b>
                  Support will reply in this chat shortly.
                </span>
              </div>
            ) : (
              <button
                className="primary-button wide"
                disabled={!supportMessage.trim()}
                onClick={() => setSupportSent(true)}
              >
                Send to partner support <ArrowRight size={17} />
              </button>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default function App() {
  const [view, setView] = useState<View>("ride")
  const [role, setRole] = useState<Role>("rider")
  const [stage, setStage] = useState<RideStage>("plan")
  const [pickup, setPickup] = useState("Koramangala 4th Block")
  const [dropoff, setDropoff] = useState("Indiranagar 100ft Road")
  const [selectedDriver, setSelectedDriver] = useState<Driver>(drivers[0])
  const [vehicleType, setVehicleType] = useState<VehicleType>("mini")
  const [offer, setOffer] = useState(420)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [activePass, setActivePass] = useState(
    () => localStorage.getItem("neardrive-pass") || "",
  )
  const [toast, setToast] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountPanel, setAccountPanel] = useState<AccountPanel | null>(null)
  const [riderProfile, setRiderProfile] = useState<ProfileData>({
    name: "Priya Sharma",
    phone: "+91 98765 43210",
    email: "priya.sharma@example.com",
    city: "Bengaluru",
    emergencyName: "Ananya Sharma",
    emergencyPhone: "+91 99887 76655",
  })
  const [driverProfile, setDriverProfile] = useState<ProfileData>({
    name: "Raj Kumar",
    phone: "+91 98450 22190",
    email: "raj.kumar@example.com",
    city: "Bengaluru",
    emergencyName: "Meera Kumar",
    emergencyPhone: "+91 99001 88221",
    vehicle: "White Swift Dzire",
    plate: "KA 01 MJ 4821",
  })
  const [preferences, setPreferences] = useState<AppPreferences>({
    rideAlerts: true,
    messages: true,
    safetyAlerts: true,
    sound: true,
    language: "English",
    autoAccept: false,
  })

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(""), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const estimatedFare = useMemo(
    () =>
      selectedDriver.fare + (offer - 420) + (vehicleType === "sedan" ? 60 : 0),
    [selectedDriver, offer, vehicleType],
  )

  function moveSlide(direction: -1 | 1) {
    if (role === "driver") {
      setView(view === "account" ? "ride" : "account")
      return
    }

    if (direction === 1 && !orderPlaced) {
      setToast("Place your ride order to unlock the next screen")
      return
    }

    const slides = [
      "ride-plan",
      "ride-offers",
      "ride-confirmed",
      "trips",
      "passes",
      "account",
    ]
    const current = view === "ride" ? `ride-${stage}` : view
    const currentIndex = Math.max(0, slides.indexOf(current))
    const nextIndex = (currentIndex + direction + slides.length) % slides.length
    const next = slides[nextIndex]

    if (next.startsWith("ride-")) {
      setView("ride")
      setStage(next.replace("ride-", "") as RideStage)
    } else {
      setView(next as View)
    }
  }

  function choosePass(name: string) {
    localStorage.setItem("neardrive-pass", name)
    setActivePass(name)
    setShowPass(false)
    setToast(`${name} pass activated`)
  }

  function requestRide() {
    if (!pickup.trim() || !dropoff.trim()) {
      setToast("Add both pickup and destination")
      return
    }
    setStage("offers")
  }

  function confirmDriver() {
    setStage("confirmed")
    setOrderPlaced(true)
    setToast(`${selectedDriver.name} is on the way`)
  }

  function resetRide() {
    setStage("plan")
    setOffer(420)
  }

  function switchRole(next: Role) {
    setRole(next)
    setMenuOpen(false)
    setView("ride")
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="slide-controls" aria-label="Prototype screen controls">
          <button onClick={() => moveSlide(-1)} aria-label="Previous screen">
            <ArrowLeft size={17} />
          </button>
          <button
            onClick={() => moveSlide(1)}
            aria-label={
              role === "rider" && !orderPlaced
                ? "Next screen locked until ride order is placed"
                : "Next screen"
            }
            title={
              role === "rider" && !orderPlaced
                ? "Place your ride order to continue"
                : "Next screen"
            }
            disabled={role === "rider" && !orderPlaced}
          >
            <ArrowRight size={17} />
          </button>
        </div>
        <Logo />
        {role === "rider" && (
          <nav className="desktop-nav" aria-label="Main navigation">
            <button
              className={view === "ride" ? "active" : ""}
              onClick={() => setView("ride")}
            >
              Find a ride
            </button>
            <button
              className={view === "trips" ? "active" : ""}
              onClick={() => setView("trips")}
            >
              My trips
            </button>
            <button
              className={view === "passes" ? "active" : ""}
              onClick={() => setView("passes")}
            >
              Passes
            </button>
          </nav>
        )}
        <div className="topbar-actions">
          <StatusPill>
            {role === "rider" ? "5 drivers nearby" : "Partner online"}
          </StatusPill>
          <button className="icon-button" aria-label="Notifications">
            <Bell size={19} />
            <i className="notification-dot" />
          </button>
          <button className="profile-button" onClick={() => setView("account")}>
            {(role === "rider" ? riderProfile.photo : driverProfile.photo) ? (
              <img
                src={
                  role === "rider" ? riderProfile.photo : driverProfile.photo
                }
                alt=""
              />
            ) : (
              <span>{role === "rider" ? "PS" : "RK"}</span>
            )}
            <b>
              {
                (role === "rider"
                  ? riderProfile.name
                  : driverProfile.name
                ).split(" ")[0]
              }
            </b>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <aside
            className="mobile-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-head">
              <Logo />
              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <p className="eyebrow">CHOOSE YOUR MODE</p>
            <button
              className={
                role === "rider" ? "drawer-role active" : "drawer-role"
              }
              onClick={() => switchRole("rider")}
            >
              <UsersRound size={20} />
              <span>
                <b>Rider / Tourist</b>
                <small>Find local drivers nearby</small>
              </span>
              <Check size={17} />
            </button>
            <button
              className={
                role === "driver" ? "drawer-role active" : "drawer-role"
              }
              onClick={() => switchRole("driver")}
            >
              <CarFront size={20} />
              <span>
                <b>Driver Partner</b>
                <small>Get requests, keep 100%</small>
              </span>
              {role === "driver" && <Check size={17} />}
            </button>
            <div className="drawer-links">
              <button
                onClick={() => {
                  setView("account")
                  setMenuOpen(false)
                }}
              >
                <UserRound size={18} /> My profile <ChevronRight size={17} />
              </button>
              <button
                onClick={() => {
                  setView("trips")
                  setMenuOpen(false)
                }}
              >
                <Route size={18} /> My trips <ChevronRight size={17} />
              </button>
              <button
                onClick={() => {
                  setShowPass(true)
                  setMenuOpen(false)
                }}
              >
                <CreditCard size={18} /> Passes <ChevronRight size={17} />
              </button>
              <button
                onClick={() => {
                  setAccountPanel("safety")
                  setMenuOpen(false)
                }}
              >
                <CircleHelp size={18} /> Help & safety{" "}
                <ChevronRight size={17} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {role === "driver" && view !== "account" ? (
        <DriverDashboard
          activePass={activePass}
          onPass={() => setShowPass(true)}
          onSwitch={() => switchRole("rider")}
          onProfile={() => setView("account")}
        />
      ) : view === "ride" ? (
        <main className="ride-page">
          <section className="booking-panel">
            {stage === "confirmed" ? (
              <div className="confirmed-panel">
                <button className="back-button" onClick={resetRide}>
                  <ArrowLeft size={17} /> Plan another ride
                </button>
                <div className="success-orbit">
                  <CarFront size={27} />
                </div>
                <p className="eyebrow">RIDE CONFIRMED</p>
                <h1>Your driver is 3 min away</h1>
                <p className="panel-subtitle">
                  Meet at the pickup point. Settle your fare directly with the
                  driver.
                </p>
                <div className="pin-card">
                  <span>
                    <small>START RIDE PIN</small>
                    <strong>4892</strong>
                  </span>
                  <span>
                    <ShieldCheck size={20} />
                    <small>Only share once inside the car</small>
                  </span>
                </div>
                <DriverCard
                  driver={selectedDriver}
                  selected
                  onSelect={() => {}}
                />
                <div className="trip-path">
                  <span className="route-nodes">
                    <i />
                    <b />
                    <i />
                  </span>
                  <span>
                    <b>{pickup}</b>
                    <small>Pickup point · 0.8 km away</small>
                    <b>{dropoff}</b>
                    <small>7.2 km · about 18 min</small>
                  </span>
                </div>
                <div className="fare-locked">
                  <span>
                    <small>AGREED FARE</small>
                    <strong>₹{estimatedFare}</strong>
                  </span>
                  <span>
                    <ShieldCheck size={18} /> Zero platform cut
                  </span>
                </div>
                <div className="contact-actions">
                  <button className="primary-button">
                    <Phone size={18} /> Call driver
                  </button>
                  <button className="icon-button outlined">
                    <MessageCircle size={19} />
                  </button>
                </div>
                <button className="cancel-link" onClick={resetRide}>
                  Cancel request
                </button>
              </div>
            ) : stage === "offers" ? (
              <div className="offers-panel">
                <button
                  className="back-button"
                  onClick={() => setStage("plan")}
                >
                  <ArrowLeft size={17} /> Edit route
                </button>
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">DIRECT FARE OFFERS</p>
                    <h1>Choose your driver</h1>
                  </div>
                  <span className="live-badge">
                    <i /> LIVE
                  </span>
                </div>
                <p className="panel-subtitle">
                  Compare verified local drivers. NearDrive takes 0% of the ride
                  fare.
                </p>
                <div className="offer-route">
                  <MapPin size={18} />
                  <span>
                    <b>{pickup}</b>
                    <ArrowRight size={14} />
                    <b>{dropoff}</b>
                  </span>
                </div>
                <div className="driver-list">
                  {drivers.map((driver) => (
                    <DriverCard
                      key={driver.id}
                      driver={driver}
                      selected={selectedDriver.id === driver.id}
                      onSelect={() => {
                        setSelectedDriver(driver)
                        setOffer(420)
                      }}
                    />
                  ))}
                </div>
                <div className="negotiation-box">
                  <div>
                    <p className="eyebrow">
                      YOUR OFFER TO {selectedDriver.name.toUpperCase()}
                    </p>
                    <span>Recommended community fare</span>
                  </div>
                  <div className="fare-stepper">
                    <button onClick={() => setOffer(Math.max(350, offer - 10))}>
                      <Minus size={17} />
                    </button>
                    <strong>₹{estimatedFare}</strong>
                    <button onClick={() => setOffer(Math.min(600, offer + 10))}>
                      <Plus size={17} />
                    </button>
                  </div>
                  <div className="fare-chips">
                    <button onClick={() => setOffer(390)}>Meter ₹390</button>
                    <button className="active" onClick={() => setOffer(420)}>
                      Fair ₹420
                    </button>
                    <button onClick={() => setOffer(450)}>Rush ₹450</button>
                  </div>
                </div>
                <button className="primary-button wide" onClick={confirmDriver}>
                  Send ₹{estimatedFare} offer <ArrowRight size={18} />
                </button>
                <p className="microcopy">
                  <ShieldCheck size={14} /> No charge by NearDrive · pay the
                  driver directly
                </p>
              </div>
            ) : (
              <>
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">DIRECT LOCAL RIDES</p>
                    <h1>Where are you going?</h1>
                  </div>
                  <span className="live-badge">
                    <i /> LIVE RADAR
                  </span>
                </div>
                <p className="panel-subtitle">
                  Connect with a verified driver nearby and agree on a fair
                  price together.
                </p>
                <div className="location-fields">
                  <span className="field-rail">
                    <i />
                    <b />
                    <i />
                  </span>
                  <label>
                    <span>Pickup</span>
                    <input
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                    />
                    <LocateFixed size={17} />
                  </label>
                  <label>
                    <span>Where to?</span>
                    <input
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                    />
                    <Search size={17} />
                  </label>
                </div>
                <div className="saved-places">
                  {savedPlaces.map(({ icon: Icon, label, detail }) => (
                    <button key={label} onClick={() => setDropoff(detail)}>
                      <span>
                        <Icon size={17} />
                      </span>
                      <b>{label}</b>
                      <small>{detail}</small>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
                <div className="ride-options">
                  <button
                    className={vehicleType === "mini" ? "selected" : ""}
                    onClick={() => setVehicleType("mini")}
                    aria-pressed={vehicleType === "mini"}
                  >
                    <CarFront size={20} />
                    <span>
                      <b>NearMini</b>
                      <small>3 min · ₹350+</small>
                    </span>
                    {vehicleType === "mini" && <Check size={15} />}
                  </button>
                  <button
                    className={vehicleType === "sedan" ? "selected" : ""}
                    onClick={() => setVehicleType("sedan")}
                    aria-pressed={vehicleType === "sedan"}
                  >
                    <UsersRound size={20} />
                    <span>
                      <b>NearSedan</b>
                      <small>5 min · ₹410+</small>
                    </span>
                    {vehicleType === "sedan" && <Check size={15} />}
                  </button>
                </div>
                <div className="trust-strip">
                  <ShieldCheck size={20} />
                  <span>
                    <b>Direct settlement</b>
                    <small>100% of your fare goes to the driver</small>
                  </span>
                  <span className="zero-badge">0% CUT</span>
                </div>
                <button className="primary-button wide" onClick={requestRide}>
                  Find nearby drivers <ArrowRight size={18} />
                </button>
                <p className="microcopy">
                  <Zap size={13} /> Usually matched in under 60 seconds
                </p>
              </>
            )}
          </section>
          <section className="map-panel">
            <MapCanvas
              stage={stage}
              onDriver={(driver) => {
                setSelectedDriver(driver)
                setStage("offers")
              }}
            />
          </section>
        </main>
      ) : view === "passes" ? (
        <main className="content-page">
          <div className="page-title">
            <p className="eyebrow">NEARDRIVE ACCESS</p>
            <h1>Simple passes, no surprises</h1>
            <p>
              Pay NearDrive only for matching access. Your ride payments always
              stay between you and the driver.
            </p>
          </div>
          <div className="pass-overview">
            <div className="benefits-card">
              <span className="benefit-icon">
                <ShieldCheck size={25} />
              </span>
              <h2>Why use a pass?</h2>
              <ul>
                <li>
                  <Check size={16} /> Unlimited nearby driver matching
                </li>
                <li>
                  <Check size={16} /> Direct call and chat access
                </li>
                <li>
                  <Check size={16} /> Zero surge markups from NearDrive
                </li>
                <li>
                  <Check size={16} /> Safety PIN and verified profiles
                </li>
              </ul>
            </div>
            <div className="current-pass-card">
              <p className="eyebrow">YOUR ACTIVE PASS</p>
              <h2>{activePass || "No active pass"}</h2>
              <p>
                {activePass
                  ? "Your unlimited matching access is ready."
                  : "Choose a flexible pass whenever you need a local ride."}
              </p>
              <button
                className="primary-button"
                onClick={() => setShowPass(true)}
              >
                {activePass ? "Manage pass" : "Choose a pass"}{" "}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </main>
      ) : view === "trips" ? (
        <main className="content-page">
          <div className="page-title">
            <p className="eyebrow">YOUR JOURNEYS</p>
            <h1>My trips</h1>
            <p>
              Ride details and direct settlement records for your reference.
            </p>
          </div>
          <div className="trips-list">
            <div className="trip-card">
              <span className="trip-date">
                <b>24</b>JUN
              </span>
              <div>
                <h3>
                  Koramangala <ArrowRight size={14} /> Indiranagar
                </h3>
                <p>Raj 'Raj' Kumar · White Swift Dzire</p>
                <span>
                  <Check size={13} /> Completed · Directly paid ₹420
                </span>
              </div>
              <button className="secondary-button">View details</button>
            </div>
            <div className="trip-card">
              <span className="trip-date">
                <b>18</b>JUN
              </span>
              <div>
                <h3>
                  MG Road <ArrowRight size={14} /> Bengaluru Airport
                </h3>
                <p>Ameen K. · Blue Maruti Baleno</p>
                <span>
                  <Check size={13} /> Completed · Directly paid ₹940
                </span>
              </div>
              <button className="secondary-button">View details</button>
            </div>
          </div>
        </main>
      ) : (
        <main className="content-page account-page">
          <div className="profile-hero">
            {(role === "rider" ? riderProfile.photo : driverProfile.photo) ? (
              <img
                className="profile-large profile-photo"
                src={
                  role === "rider" ? riderProfile.photo : driverProfile.photo
                }
                alt={`${
                  role === "rider" ? riderProfile.name : driverProfile.name
                } profile`}
              />
            ) : (
              <span className="profile-large">
                {(role === "rider" ? riderProfile.name : driverProfile.name)
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
            <div>
              <p className="eyebrow">
                {role === "rider"
                  ? "VERIFIED TOURIST"
                  : "VERIFIED DRIVER PARTNER"}
              </p>
              <h1>
                {role === "rider" ? riderProfile.name : driverProfile.name}{" "}
                <BadgeCheck size={20} fill="#16875f" />
              </h1>
              <p>
                {role === "rider"
                  ? "Member since June 2025 · 4.92 rider rating"
                  : `${driverProfile.vehicle} · ${driverProfile.plate}`}
              </p>
            </div>
          </div>
          <div className="account-grid">
            <button onClick={() => setAccountPanel("details")}>
              <UserRound size={20} />
              <span>
                <b>Personal details</b>
                <small>
                  {(role === "rider" ? riderProfile : driverProfile).phone} ·{" "}
                  {(role === "rider" ? riderProfile : driverProfile).city}
                </small>
              </span>
              <ChevronRight size={18} />
            </button>
            <button onClick={() => setShowPass(true)}>
              <CreditCard size={20} />
              <span>
                <b>Pass & billing</b>
                <small>{activePass || "No active pass"}</small>
              </span>
              <ChevronRight size={18} />
            </button>
            <button onClick={() => setAccountPanel("safety")}>
              <ShieldCheck size={20} />
              <span>
                <b>Safety center</b>
                <small>
                  Emergency:{" "}
                  {
                    (role === "rider" ? riderProfile : driverProfile)
                      .emergencyName
                  }
                </small>
              </span>
              <ChevronRight size={18} />
            </button>
            <button onClick={() => setAccountPanel("settings")}>
              <Settings size={20} />
              <span>
                <b>App settings</b>
                <small>Notifications and {preferences.language} language</small>
              </span>
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            className="switch-mode account-switch"
            onClick={() => switchRole(role === "rider" ? "driver" : "rider")}
          >
            {role === "rider" ? (
              <>
                <CarFront size={18} /> Switch to driver partner mode
              </>
            ) : (
              <>
                <UsersRound size={18} /> Switch to rider mode
              </>
            )}
          </button>
        </main>
      )}

      {role === "rider" && (
        <nav className="mobile-bottom-nav">
          <button
            className={view === "ride" ? "active" : ""}
            onClick={() => setView("ride")}
          >
            <Navigation size={20} />
            <span>Ride</span>
          </button>
          <button
            className={view === "trips" ? "active" : ""}
            onClick={() => setView("trips")}
          >
            <Route size={20} />
            <span>Trips</span>
          </button>
          <button
            className={view === "passes" ? "active" : ""}
            onClick={() => setView("passes")}
          >
            <CreditCard size={20} />
            <span>Pass</span>
          </button>
          <button
            className={view === "account" ? "active" : ""}
            onClick={() => setView("account")}
          >
            <UserRound size={20} />
            <span>Profile</span>
          </button>
        </nav>
      )}

      {showPass && (
        <PassModal
          role={role}
          onClose={() => setShowPass(false)}
          onActivate={choosePass}
        />
      )}
      {accountPanel && (
        <AccountSheet
          panel={accountPanel}
          role={role}
          profile={role === "rider" ? riderProfile : driverProfile}
          preferences={preferences}
          onProfileChange={
            role === "rider" ? setRiderProfile : setDriverProfile
          }
          onPreferencesChange={setPreferences}
          onClose={() => {
            setAccountPanel(null)
            setToast(
              accountPanel === "settings"
                ? "Settings saved"
                : accountPanel === "safety"
                  ? "Safety details saved"
                  : "Personal details updated",
            )
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <Check size={17} /> {toast}
        </div>
      )}
    </div>
  )
}
