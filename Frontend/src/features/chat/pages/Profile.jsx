import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  ShieldCheck,
  Mail,
  User,
  Calendar,
  LogOut,
  Edit3,
  Copy,
  Check,
} from "lucide-react";

// ─── Perplexity SVG Logo ──────────────────────────────────────────────────────
const PerplexityLogo = ({ size = 18, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M5.73486 2L11.4299 7.24715V7.24595V2.01211H12.5385V7.27063L18.2591 2V7.98253H20.6078V16.6118H18.2663V21.9389L12.5385 16.9066V21.9967H11.4299V16.9896L5.74131 22V16.6118H3.39258V7.98253H5.73486V2ZM10.5942 9.0776H4.50118V15.5167H5.73992V13.4856L10.5942 9.0776ZM6.84986 13.9715V19.5565L11.4299 15.5225V9.81146L6.84986 13.9715ZM12.5704 15.4691L17.1577 19.4994V16.6118H17.1518V13.9663L12.5704 9.80608V15.4691ZM18.2663 15.5167H19.4992V9.0776H13.4516L18.2663 13.4399V15.5167ZM17.1505 7.98253V4.51888L13.3911 7.98253H17.1505ZM10.6028 7.98253L6.84346 4.51888V7.98253H10.6028Z" />
  </svg>
);

// ─── Animated counter ─────────────────────────────────────────────────────────
const AnimatedStat = ({ value, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col gap-1.5"
  >
    <div className="flex items-center gap-2">
      <Icon size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
      <span
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.12em",
          color: "rgba(255,255,255,0.22)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.15 }}
      style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "2.4rem",
        fontWeight: 300,
        lineHeight: 1,
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "-0.03em",
      }}
    >
      {value}
    </motion.span>
  </motion.div>
);

// ─── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, copiable = false, delay = 0 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copiable) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-4 py-3.5 group"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <Icon size={15} style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
      <div className="flex flex-col min-w-0 flex-1">
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            marginBottom: "2px",
          }}
        >
          {label}
        </span>
        <span
          className="truncate"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {value}
        </span>
      </div>
      {copiable && (
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md"
          style={{ background: "rgba(255,255,255,0.04)" }}
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
          ) : (
            <Copy size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
          )}
        </button>
      )}
    </motion.div>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────
const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);

  const chatCount = Object.keys(chats).length;
  const totalMessages = Object.values(chats).reduce(
    (sum, c) => sum + (c.messages?.length || 0),
    0
  );
  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "MMM yyyy")
    : "—";
  const memberSinceFull = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM d, yyyy")
    : "—";
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  // Staggered container
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,300&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display  { font-family: 'Fraunces', serif; }
        .font-mono-dm  { font-family: 'DM Mono', monospace; }
        .font-sans-dm  { font-family: 'DM Sans', sans-serif; }
        .profile-scroll::-webkit-scrollbar { display: none; }
        .profile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes grain {
          0%,100% { transform: translate(0,0); }
          25%      { transform: translate(2px,-2px); }
          50%      { transform: translate(-2px,2px); }
          75%      { transform: translate(2px,2px); }
        }
      `}</style>

      <div
        className="font-sans-dm min-h-screen profile-scroll overflow-y-auto relative"
        style={{ background: "#080808", color: "rgba(255,255,255,0.8)" }}
      >

        {/* ── Ambient blobs ── */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.03), transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.02), transparent 70%)" }}
          />
        </div>

        {/* ── Top nav bar ── */}
        <nav
          className="relative z-20 flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.35)" }}
              aria-label="Back to chat"
            >
              <ArrowLeft size={16} />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Back
              </span>
            </motion.button>
          </div>

          {/* Logo centred */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <PerplexityLogo
              size={16}
              className="opacity-40"
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "-0.01em",
              }}
            >
              Perplexity
            </span>
          </div>

          {/* Right spacer to balance flex */}
          <div className="w-16" />
        </nav>

        {/* ── Main grid ── */}
        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-24">

          {/* ── HERO ROW ─── avatar + identity ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-8 mb-16">

            {/* Avatar block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              {/* Outer ring */}
              <div
                className="w-28 h-28 rounded-3xl flex items-center justify-center relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 60px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                {/* Grain overlay */}
                <div
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
                    backgroundSize: "128px",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: "3rem",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {avatarLetter}
                </span>
              </div>

              {/* Verified badge */}
              {user?.verified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                  className="absolute -bottom-2 -right-2 rounded-full p-1.5 flex items-center justify-center"
                  style={{
                    background: "#080808",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  title="Verified account"
                >
                  <ShieldCheck size={14} style={{ color: "rgba(255,255,255,0.55)" }} />
                </motion.div>
              )}
            </motion.div>

            {/* Identity */}
            <div className="flex flex-col gap-1.5 pb-1">
              {/* Eyebrow label */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.16em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                User Profile
              </motion.span>

              {/* Name — display type */}
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "clamp(2.2rem, 6vw, 3.5rem)",
                  fontWeight: 300,
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {user?.username || "Anonymous"}
              </motion.h1>

              {/* Email */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.03em",
                }}
              >
                {user?.email || ""}
              </motion.p>

              {/* Status pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="flex flex-wrap gap-2 mt-1"
              >
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.06em",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.4)" }}
                  />
                  Standard Plan
                </span>
                {user?.verified && (
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    <ShieldCheck size={10} />
                    Verified
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* ── BENTO GRID ─────────────────────────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 gap-px mb-px"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Stat cell 1 — Chats */}
            <div
              className="col-span-1 px-6 py-7"
              style={{ background: "#080808" }}
            >
              <AnimatedStat
                value={chatCount}
                label="Threads"
                icon={MessageSquare}
                delay={0.2}
              />
            </div>

            {/* Stat cell 2 — Messages */}
            <div
              className="col-span-1 px-6 py-7"
              style={{ background: "#080808", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
            >
              <AnimatedStat
                value={totalMessages}
                label="Messages"
                icon={Clock}
                delay={0.28}
              />
            </div>

            {/* Stat cell 3 — Since */}
            <div
              className="col-span-2 sm:col-span-1 px-6 py-7"
              style={{
                background: "#080808",
                borderLeft: "1px solid rgba(255,255,255,0.05)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <AnimatedStat
                value={memberSince}
                label="Member Since"
                icon={Calendar}
                delay={0.36}
              />
            </div>
          </motion.div>

          {/* ── TWO COLUMN INFO ─────────────────────────────────────────────── */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Account details card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p
                className="mb-4"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.16em",
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                Account Details
              </p>

              <InfoRow icon={User}     label="Username"    value={user?.username || "—"}        delay={0.38} />
              <InfoRow icon={Mail}     label="Email"       value={user?.email || "—"}           delay={0.41} copiable />
              <InfoRow icon={Calendar} label="Joined"      value={memberSinceFull}              delay={0.44} />
              <InfoRow
                icon={ShieldCheck}
                label="Account Status"
                value={user?.verified ? "Verified" : "Unverified"}
                delay={0.47}
              />
            </motion.div>

            {/* Right column — usage card + action card stacked */}
            <div className="flex flex-col gap-6">

              {/* Usage summary */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.42 }}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  className="mb-5"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.16em",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                  }}
                >
                  Usage
                </p>

                {/* Bar chart row */}
                {[
                  { label: "Threads", value: chatCount, max: Math.max(chatCount, 10) },
                  { label: "Messages", value: totalMessages, max: Math.max(totalMessages, 20) },
                ].map(({ label, value, max }, i) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1.5">
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.25)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{
                        height: "2px",
                        background: "rgba(255,255,255,0.06)",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: "rgba(255,255,255,0.35)" }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Actions card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 }}
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p
                  className="mb-4"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.16em",
                    color: "rgba(255,255,255,0.2)",
                    textTransform: "uppercase",
                  }}
                >
                  Actions
                </p>

                <div className="space-y-2">
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                    }}
                    onClick={() => navigate("/")}
                  >
                    <MessageSquare size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
                    Go to Threads
                    <span
                      className="ml-auto"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      →
                    </span>
                  </motion.button>

                  {/* Edit profile placeholder */}
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                    }}
                  >
                    <Edit3 size={14} style={{ color: "rgba(255,255,255,0.25)" }} />
                    Edit Profile
                    <span
                      className="ml-auto px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      soon
                    </span>
                  </motion.button>

                  {/* Sign out */}
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
                    style={{
                      background: "rgba(220,38,38,0.04)",
                      border: "1px solid rgba(220,38,38,0.08)",
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "13px",
                    }}
                  >
                    <LogOut size={14} style={{ color: "rgba(220,38,38,0.45)" }} />
                    Sign Out
                    <span
                      className="ml-auto"
                      style={{ color: "rgba(255,255,255,0.12)" }}
                    >
                      →
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── FOOTER RULE ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px" }}
          >
            <div className="flex items-center gap-2">
              <PerplexityLogo size={13} className="opacity-20" />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.15)",
                }}
              >
                Perplexity
              </span>
            </div>
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.1)",
              }}
            >
              v0.1.0
            </span>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;