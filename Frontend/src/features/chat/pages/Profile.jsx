import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
} from "lucide-react";
import { useAuth } from "../../auth/hook/useAuth";
import toast from "react-hot-toast";

const PerplexityIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2V22M12 12L20 4M12 12L4 4M12 12L20 20M12 12L4 20M2 12H22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StatTile = ({ value, label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-[#fdfbfa] border border-[#d1d1cd] p-5 rounded-[16px] card-subtle-shadow flex flex-col justify-between"
  >
    <div className="flex items-center gap-2 mb-3">
      <Icon size={16} className="text-[#016a71]" />
      <span className="text-[11px] font-mono tracking-wider uppercase text-[#72706b]">
        {label}
      </span>
    </div>
    <span className="text-[28px] font-medium text-[#27251e] tracking-tight">
      {value}
    </span>
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
          className="p-1.5 rounded-lg border border-[#d1d1cd] hover:bg-[#f0ede6] text-[#72706b] hover:text-[#27251e] transition-colors"
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
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const chats = useSelector((state) => state.chat.chats);

  const chatCount = Object.keys(chats).length;
  const totalMessages = Object.values(chats).reduce(
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
    <div className="bg-[#faf8f5] text-[#27251e] min-h-screen font-sans selection:bg-[#016a71]/15 overflow-y-auto custom-scrollbar">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#d1d1cd]">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#72706b] hover:text-[#27251e] text-[13px] font-normal transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Search</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#27251e] text-[#faf8f5] flex items-center justify-center">
            <PerplexityIcon size={14} />
          </div>
          <span className="font-medium text-[15px] tracking-tight text-[#27251e]">
            perplexity
          </span>
        </div>

        <div className="w-20" />
      </nav>

      {/* Main Profile Content */}
      <main className="max-w-[800px] mx-auto px-5 pt-8 pb-16">
        {/* User Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8 pb-6 border-b border-[#d1d1cd]">
          <div className="w-18 h-18 rounded-2xl bg-[#016a71] text-white flex items-center justify-center text-[28px] font-medium shadow-sm shrink-0">
            {avatarLetter}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-medium text-[#27251e] tracking-tight">
                {user?.username || "Account"}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#016a71]/10 text-[#016a71] text-[11px] font-mono font-medium">
                Standard
              </span>
            </div>
            <p className="text-[13px] text-[#72706b]">
              {user?.email || "Member"}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatTile
            value={chatCount}
            label="Threads"
            icon={MessageSquare}
            delay={0.1}
          />
          <StatTile
            value={totalMessages}
            label="Messages"
            icon={Clock}
            delay={0.15}
          />
          <StatTile
            value={memberSince}
            label="Member Since"
            icon={Calendar}
            delay={0.2}
          />
        </div>

        {/* 2-Column Info & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-5 card-subtle-shadow">
            <h3 className="text-[12px] font-mono uppercase tracking-wider text-[#92918b] mb-3">
              Account Details
            </h3>

            <div className="space-y-1">
              <InfoRow icon={User} label="Username" value={user?.username} />
              <InfoRow icon={Mail} label="Email" value={user?.email} copiable />
              <InfoRow icon={Calendar} label="Joined" value={memberSinceFull} />
              <InfoRow icon={ShieldCheck} label="Status" value="Verified" />
            </div>
          </div>

          {/* Usage & Actions */}
          <div className="flex flex-col gap-5">
            {/* Usage */}
            <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-5 card-subtle-shadow">
              <h3 className="text-[12px] font-mono uppercase tracking-wider text-[#92918b] mb-4">
                Research Activity
              </h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[12px] mb-1 text-[#72706b]">
                    <span>Threads Active</span>
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
                  <div className="flex justify-between text-[12px] mb-1 text-[#72706b]">
                    <span>Total Queries</span>
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

            {/* Quick Actions */}
            <div className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] p-5 card-subtle-shadow space-y-2.5">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#d1d1cd] bg-[#faf8f5] text-[#27251e] hover:bg-[#f0ede6] transition-colors text-[13px]"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-[#016a71]" />
                  <span>Start New Research Thread</span>
                </span>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-[#93000a]/20 bg-[#93000a]/5 text-[#93000a] hover:bg-[#93000a]/10 transition-colors text-[13px]"
              >
                <span className="flex items-center gap-2">
                  <LogOut size={15} />
                  <span>Sign out</span>
                </span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
