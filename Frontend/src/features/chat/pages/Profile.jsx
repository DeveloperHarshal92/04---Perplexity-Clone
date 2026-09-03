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
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "../../auth/hook/useAuth";
import toast from "react-hot-toast";
import { PerplexusIcon } from "../../../components/PerplexusLogo.jsx";

const StatTile = ({ value, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay }}
    className="p-1 rounded-[18px] bg-[#f0ede6]/60 border border-[#d1d1cd]"
  >
    <div className="bg-[#fdfbfa] p-5 rounded-[14px] card-subtle-shadow flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-mono tracking-wider uppercase text-[#72706b]">
          {label}
        </span>
        <div className="w-6 h-6 rounded-full bg-[#f0ede6] flex items-center justify-center">
          <Icon size={14} className="text-[#016a71]" />
        </div>
      </div>
      <span className="text-[26px] font-normal text-[#27251e] tracking-tight">
        {value}
      </span>
    </div>
  </motion.div>
);

const InfoRow = ({ icon: Icon, label, value, copiable = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copiable || !value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#d1d1cd]/50 last:border-0">
      <Icon size={16} className="text-[#72706b] shrink-0" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#92918b]">
          {label}
        </span>
        <span className="truncate text-[14px] text-[#27251e] font-normal">
          {value || "Not available"}
        </span>
      </div>
      {copiable && (
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-[6px] border border-[#d1d1cd] hover:bg-[#f0ede6] text-[#72706b] hover:text-[#27251e] active:scale-[0.98] transition-all cursor-pointer"
          title={`Copy ${label}`}
        >
          {copied ? (
            <Check size={13} className="text-[#016a71]" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      )}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);

  const chatList = Object.values(chats);
  const chatCount = chatList.length;
  const totalMessages = chatList.reduce(
    (sum, c) => sum + (c.messages?.length || 0),
    0,
  );
  const memberSince = user?.createdAt
    ? format(new Date(user.createdAt), "MMM yyyy")
    : "Active";
  const memberSinceFull = user?.createdAt
    ? format(new Date(user.createdAt), "MMMM d, yyyy")
    : "Recent";
  const { handleLogout } = useAuth();
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || "U";

  const handleSignOut = () => {
    handleLogout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  return (
    <div className="bg-[#faf8f5] text-[#27251e] min-h-[100dvh] font-sans selection:bg-[#016a71]/15 overflow-y-auto custom-scrollbar">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 h-[52px] bg-[#faf8f5]/95 backdrop-blur-xs border-b border-[#d1d1cd]">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#72706b] hover:text-[#27251e] text-[13px] font-normal transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 text-[#27251e] flex items-center justify-center">
            <PerplexusIcon size={18} />
          </div>
          <span
            className="font-medium text-[16px] tracking-tight text-[#27251e]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
          >
            Perplexus
          </span>
        </div>

        <div className="w-24" />
      </nav>

      {/* Main Profile Content */}
      <main className="max-w-[840px] mx-auto px-5 pt-8 pb-16">
        {/* User Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 pb-6 border-b border-[#d1d1cd]">
          <div className="w-16 h-16 rounded-[16px] bg-[#27251e] text-[#faf8f5] flex items-center justify-center text-[24px] font-normal shadow-xs shrink-0">
            {avatarLetter}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] font-normal text-[#27251e] tracking-tight">
                {user?.username || "Perplexus Researcher"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#016a71] text-white text-[11px] font-mono font-medium">
                Verified
              </span>
            </div>
            <p className="text-[13px] text-[#72706b] font-normal">
              {user?.email || "Perplexus Academic Workspace"}
            </p>
          </div>
        </div>

        {/* Stats Grid: Gapless 3-column with double-bezel containment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatTile
            value={chatCount}
            label="Threads"
            icon={MessageSquare}
            delay={0.05}
          />
          <StatTile
            value={totalMessages}
            label="Queries"
            icon={Clock}
            delay={0.1}
          />
          <StatTile
            value={memberSince}
            label="Member Since"
            icon={Calendar}
            delay={0.15}
          />
        </div>

        {/* 2-Column Info & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-5 card-subtle-shadow">
            <h2 className="text-[12px] font-mono uppercase tracking-wider text-[#72706b] mb-3 font-normal">
              Account Credentials
            </h2>

            <div className="space-y-1">
              <InfoRow icon={User} label="Username" value={user?.username} />
              <InfoRow icon={Mail} label="Email" value={user?.email} copiable />
              <InfoRow icon={Calendar} label="Joined" value={memberSinceFull} />
              <InfoRow icon={ShieldCheck} label="Security" value="Encrypted (Passkey)" />
            </div>
          </div>

          {/* Usage & Actions */}
          <div className="flex flex-col gap-5">
            {/* Usage / Telemetry */}
            <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-5 card-subtle-shadow">
              <h2 className="text-[12px] font-mono uppercase tracking-wider text-[#72706b] mb-4 font-normal">
                Research Activity
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[12px] mb-1.5 text-[#72706b] font-normal">
                    <span>Active Workspace Threads</span>
                    <span className="font-mono text-[#27251e]">
                      {chatCount}
                    </span>
                  </div>
                  <div className="w-full bg-[#f0ede6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#016a71] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((chatCount / 20) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[12px] mb-1.5 text-[#72706b] font-normal">
                    <span>Compiled Syntheses</span>
                    <span className="font-mono text-[#27251e]">
                      {totalMessages}
                    </span>
                  </div>
                  <div className="w-full bg-[#f0ede6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#016a71] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min((totalMessages / 50) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions with Nested CTA architecture */}
            <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-5 card-subtle-shadow space-y-2.5">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="group w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] border border-[#d1d1cd] bg-[#faf8f5] text-[#27251e] hover:bg-[#f0ede6] active:scale-[0.99] transition-all text-[13px] font-normal cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <MessageSquare size={15} className="text-[#016a71]" />
                  <span>Start New Research Thread</span>
                </span>
                <span className="w-6 h-6 rounded-full bg-[#f0ede6] flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight size={13} className="text-[#27251e]" />
                </span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] border border-[#d1d1cd] bg-[#faf8f5] text-[#72706b] hover:text-[#93000a] hover:bg-[#f0ede6] active:scale-[0.99] transition-all text-[13px] font-normal cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <LogOut size={15} />
                  <span>Sign out</span>
                </span>
                <span className="text-[14px]">→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
