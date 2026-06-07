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

const OrchardLogo = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22C12 22 4 16 4 9C4 5 7 2 12 2C17 2 20 5 20 9C20 16 12 22 12 22Z" />
    <path d="M12 22V12" />
    <path d="M12 16C9 14 8 11 8 11" />
  </svg>
);

const AnimatedStat = ({ value, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col gap-1.5"
  >
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-[var(--text-tertiary)]" />
      <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--text-secondary)]">
        {label}
      </span>
    </div>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.15 }}
      className="font-serif font-light text-4xl text-[var(--text-primary)]"
    >
      {value}
    </motion.span>
  </motion.div>
);

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
      className="flex items-center gap-4 py-3.5 group border-b border-[var(--border)] last:border-0"
    >
      <Icon size={16} className="text-[var(--text-tertiary)] shrink-0" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-mono text-[9px] tracking-wider uppercase text-[var(--text-tertiary)] mb-[2px]">
          {label}
        </span>
        <span className="truncate font-sans text-sm text-[var(--text-secondary)]">
          {value}
        </span>
      </div>
      {copiable && (
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-[var(--border)]"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check size={12} className="text-[var(--accent)]" />
          ) : (
            <Copy size={12} className="text-[var(--text-secondary)]" />
          )}
        </button>
      )}
    </motion.div>
  );
};

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

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-serif { font-family: 'Lora', Georgia, serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .profile-scroll::-webkit-scrollbar { display: none; }
        .profile-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div
        className="font-sans min-h-screen profile-scroll overflow-y-auto relative dark"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
            style={{ background: "radial-gradient(ellipse, var(--accent), transparent 70%)" }}
          />
        </div>

        <nav
          className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-[var(--border)]"
        >
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              aria-label="Back to chat"
            >
              <ArrowLeft size={16} />
              <span className="font-mono text-[11px] tracking-wider uppercase">
                Back
              </span>
            </motion.button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <OrchardLogo size={18} className="text-[var(--accent)]" />
            <span className="font-serif font-medium text-[13px] text-[var(--text-primary)]">
              Orchard AI
            </span>
          </div>

          <div className="w-16" />
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 pt-12 pb-24">
          <div className="flex flex-col sm:flex-row sm:items-end gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0"
            >
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center relative overflow-hidden bg-[var(--accent)] text-[var(--bg-base)] shadow-lg"
              >
                <span className="font-serif text-5xl font-light">
                  {avatarLetter}
                </span>
              </div>
            </motion.div>

            <div className="flex flex-col gap-1.5 pb-1">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="font-mono text-[10px] tracking-wider uppercase text-[var(--text-tertiary)]"
              >
                User Profile
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif font-light text-5xl tracking-tight text-[var(--text-primary)]"
              >
                {user?.username || "Anonymous"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-mono text-xs text-[var(--text-secondary)] tracking-wide"
              >
                {user?.email || ""}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38 }}
                className="flex flex-wrap gap-2 mt-2"
              >
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] font-mono text-[10px] tracking-wide text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  Standard Plan
                </span>
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 gap-px mb-px bg-[var(--border)] border border-[var(--border)] rounded-2xl overflow-hidden"
          >
            <div className="col-span-1 px-6 py-7 bg-[var(--glass-bg)]" style={{ backdropFilter: "blur(24px) saturate(180%)" }}>
              <AnimatedStat
                value={chatCount}
                label="Threads"
                icon={MessageSquare}
                delay={0.2}
              />
            </div>

            <div className="col-span-1 px-6 py-7 bg-[var(--glass-bg)]" style={{ backdropFilter: "blur(24px) saturate(180%)" }}>
              <AnimatedStat
                value={totalMessages}
                label="Messages"
                icon={Clock}
                delay={0.28}
              />
            </div>

            <div className="col-span-2 sm:col-span-1 px-6 py-7 bg-[var(--glass-bg)]" style={{ backdropFilter: "blur(24px) saturate(180%)" }}>
              <AnimatedStat
                value={memberSince}
                label="Member Since"
                icon={Calendar}
                delay={0.36}
              />
            </div>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="rounded-2xl p-6 bg-[var(--glass-bg)] border border-[var(--border)]"
              style={{ backdropFilter: "blur(24px) saturate(180%)" }}
            >
              <p className="mb-4 font-mono text-[9px] tracking-wider uppercase text-[var(--text-tertiary)]">
                Account Details
              </p>

              <InfoRow icon={User} label="Username" value={user?.username || "—"} delay={0.38} />
              <InfoRow icon={Mail} label="Email" value={user?.email || "—"} delay={0.41} copiable />
              <InfoRow icon={Calendar} label="Joined" value={memberSinceFull} delay={0.44} />
              <InfoRow icon={ShieldCheck} label="Account Status" value={user?.verified ? "Verified" : "Unverified"} delay={0.47} />
            </motion.div>

            <div className="flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.42 }}
                className="rounded-2xl p-6 bg-[var(--glass-bg)] border border-[var(--border)]"
                style={{ backdropFilter: "blur(24px) saturate(180%)" }}
              >
                <p className="mb-5 font-mono text-[9px] tracking-wider uppercase text-[var(--text-tertiary)]">
                  Usage
                </p>

                {[
                  { label: "Threads", value: chatCount, max: Math.max(chatCount, 10) },
                  { label: "Messages", value: totalMessages, max: Math.max(totalMessages, 20) },
                ].map(({ label, value, max }, i) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-mono text-[10px] tracking-wider text-[var(--text-secondary)]">
                        {label}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                        {value}
                      </span>
                    </div>
                    <div className="w-full rounded-full overflow-hidden h-0.5 bg-[var(--border)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-[var(--accent)]"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.5 }}
                className="rounded-2xl p-5 bg-[var(--glass-bg)] border border-[var(--border)]"
                style={{ backdropFilter: "blur(24px) saturate(180%)" }}
              >
                <p className="mb-4 font-mono text-[9px] tracking-wider uppercase text-[var(--text-tertiary)]">
                  Actions
                </p>

                <div className="space-y-2">
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-sans text-[13px]"
                    onClick={() => navigate("/")}
                  >
                    <MessageSquare size={14} className="text-[var(--text-tertiary)]" />
                    Go to Threads
                    <span className="ml-auto text-[var(--text-tertiary)]">→</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-sans text-[13px]"
                  >
                    <Edit3 size={14} className="text-[var(--text-tertiary)]" />
                    Edit Profile
                    <span className="ml-auto px-1.5 py-0.5 rounded bg-[var(--border)] font-mono text-[9px] tracking-wider text-[var(--text-secondary)]">
                      soon
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left bg-red-500/10 border border-red-500/20 text-red-400 font-sans text-[13px]"
                  >
                    <LogOut size={14} className="text-red-500" />
                    Sign Out
                    <span className="ml-auto text-red-500/50">→</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 flex items-center justify-between pt-6 border-t border-[var(--border)]"
          >
            <div className="flex items-center gap-2">
              <OrchardLogo size={16} className="text-[var(--text-tertiary)]" />
              <span className="font-mono text-[10px] tracking-wider text-[var(--text-tertiary)]">
                Orchard AI
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-wider text-[var(--text-tertiary)]">
              v0.1.0
            </span>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;