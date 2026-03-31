import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Globe, X, FileText, Image as ImageIcon } from "lucide-react";

// ─── File Chip ─────────────────────────────────────────────────────────────────
const FileChip = ({ file, onRemove, isDark }) => {
  const isImage = file.type?.startsWith("image/");
  const [thumb, setThumb] = React.useState(null);

  useEffect(() => {
    if (!isImage || !file.file) return;
    const url = URL.createObjectURL(file.file);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [file.file, isImage]);

  const sizeLabel =
    file.size < 1024
      ? `${file.size}B`
      : file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)}KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)}MB`;

  const chipBg     = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const chipBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)";
  const thumbBg    = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const iconColor  = isDark ? "text-white/25"          : "text-black/25";
  const nameText   = isDark ? "text-white/65"          : "text-black/60";
  const sizeText   = isDark ? "text-white/20"          : "text-black/25";
  const removeBtn  = isDark ? "text-white/20 hover:text-white/70 hover:bg-white/10" : "text-black/20 hover:text-black/60 hover:bg-black/8";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.82, y: 2 }}
      transition={{ type: "spring", damping: 24, stiffness: 340 }}
      className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg shrink-0"
      style={{ background: chipBg, border: `1px solid ${chipBorder}`, maxWidth: "180px" }}
    >
      <div
        className="shrink-0 w-7 h-7 rounded-md overflow-hidden flex items-center justify-center"
        style={{ background: thumbBg }}
      >
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className={iconColor}>
            {isImage ? <ImageIcon size={14} /> : <FileText size={14} />}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-xs truncate leading-none mb-0.5 ${nameText}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {file.name}
        </p>
        <p className={`text-[10px] ${sizeText}`} style={{ fontFamily: "'DM Mono', monospace" }}>
          {sizeLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className={`shrink-0 p-0.5 rounded transition-all ${removeBtn}`}
        aria-label={`Remove ${file.name}`}
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

// ─── ChatInput ─────────────────────────────────────────────────────────────────
const ChatInput = ({
  value,
  onChange,
  onSubmit,
  attachedFiles = [],
  onFileAttach,
  onRemoveFile,
  isDark,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleChange = (e) => {
    onChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      onFileAttach?.(e.target.files);
      e.target.value = "";
    }
  };

  const canSend = value.trim() || attachedFiles.length > 0;

  // Theme tokens
  const gradientFrom   = isDark ? "#080808"                     : "#f2f2ef";
  const formBg         = isDark ? "#161616"                     : "#ffffff";
  const formBorder     = isDark ? "rgba(255,255,255,0.09)"      : "rgba(0,0,0,0.10)";
  const formShadow     = isDark ? "0 4px 24px rgba(0,0,0,0.5)" : "0 4px 24px rgba(0,0,0,0.08)";
  const textareaClass  = isDark
    ? "text-white/80 placeholder-white/18"
    : "text-black/75 placeholder-black/20";
  const toolbarBorder  = isDark ? "rgba(255,255,255,0.05)"      : "rgba(0,0,0,0.06)";
  const iconBtn        = isDark
    ? "text-white/22 hover:text-white/65 hover:bg-white/6"
    : "text-black/25 hover:text-black/60 hover:bg-black/5";
  const hintText       = isDark ? "text-white/12"               : "text-black/15";
  const footerText     = isDark ? "text-white/12"               : "text-black/15";
  const sendActiveBg      = isDark ? "rgba(255,255,255,0.9)"    : "rgba(0,0,0,0.85)";
  const sendActiveColor   = isDark ? "#080808"                  : "#f2f2ef";
  const sendInactiveBg    = isDark ? "rgba(255,255,255,0.06)"   : "rgba(0,0,0,0.06)";
  const sendInactiveColor = isDark ? "rgba(255,255,255,0.2)"    : "rgba(0,0,0,0.2)";
  const sendInactiveBorder = isDark ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.06)";

  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-5 pt-10"
      style={{ background: `linear-gradient(to top, ${gradientFrom} 55%, transparent)` }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.form
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          onSubmit={onSubmit}
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{ background: formBg, border: `1px solid ${formBorder}`, boxShadow: formShadow }}
        >
          {/* File chips */}
          <AnimatePresence initial={false}>
            {attachedFiles.length > 0 && (
              <motion.div
                key="chips-zone"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div
                  className="flex flex-wrap gap-2 px-4 pt-3 pb-5 overflow-y-auto"
                  style={{ maxHeight: "112px", scrollbarWidth: "none" }}
                >
                  <AnimatePresence>
                    {attachedFiles.map((file) => (
                      <FileChip key={file.id} file={file} onRemove={onRemoveFile} isDark={isDark} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-full bg-transparent px-4 pt-3.5 pb-2 outline-none resize-none text-sm leading-relaxed ${textareaClass}`}
            placeholder="Ask anything… (⌘K)"
            rows="1"
            style={{
              maxHeight: "180px",
              fontFamily: "'DM Sans', sans-serif",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          />

          {/* Toolbar */}
          <div
            className="flex justify-between items-center px-3 pb-2.5 pt-1.5"
            style={{ borderTop: `1px solid ${toolbarBorder}` }}
          >
            <div className="flex gap-0.5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition-all ${iconBtn}`}
                title="Attach file"
              >
                <Paperclip size={17} />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-all ${iconBtn}`}
                title="Search web"
              >
                <Globe size={17} />
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs hidden sm:block ${hintText}`}
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                ⇧↵ newline
              </span>
              <motion.button
                type="submit"
                disabled={!canSend}
                whileHover={canSend ? { scale: 1.06 } : {}}
                whileTap={canSend ? { scale: 0.94 } : {}}
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                style={
                  canSend
                    ? { background: sendActiveBg, color: sendActiveColor }
                    : { background: sendInactiveBg, color: sendInactiveColor, border: `1px solid ${sendInactiveBorder}` }
                }
                aria-label="Send message"
              >
                <Send size={15} />
              </motion.button>
            </div>
          </div>
        </motion.form>

        <p
          className={`text-center text-xs mt-2.5 ${footerText}`}
          style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.01em" }}
        >
          Perplexity can make mistakes — verify critical information
        </p>
      </div>
    </div>
  );
};

export default ChatInput;