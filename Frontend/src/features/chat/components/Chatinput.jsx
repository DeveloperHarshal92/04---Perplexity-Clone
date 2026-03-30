import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Globe, X, FileText, Image as ImageIcon } from "lucide-react";

// ─── File Chip (lives INSIDE the unified container) ───────────────────────────
const FileChip = ({ file, onRemove }) => {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.82, y: 2 }}
      transition={{ type: "spring", damping: 24, stiffness: 340 }}
      className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg shrink-0"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        maxWidth: "180px",
      }}
    >
      {/* Thumbnail or generic icon */}
      <div
        className="shrink-0 w-7 h-7 rounded-md overflow-hidden flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.05)" }}
      >
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-white/25">
            {isImage ? <ImageIcon size={13} /> : <FileText size={13} />}
          </span>
        )}
      </div>

      {/* Name + size */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs text-white/65 truncate leading-none mb-0.5"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {file.name}
        </p>
        <p
          className="text-[10px] text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {sizeLabel}
        </p>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="shrink-0 p-0.5 rounded text-white/20 hover:text-white/70 hover:bg-white/10 transition-all"
        aria-label={`Remove ${file.name}`}
      >
        <X size={11} />
      </button>
    </motion.div>
  );
};

// ─── ChatInput ────────────────────────────────────────────────────────────────
const ChatInput = ({
  value,
  onChange,
  onSubmit,
  attachedFiles = [],
  onFileAttach,
  onRemoveFile,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // ⌘K / Ctrl+K → focus textarea
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
    // Auto-resize: shrink then grow to fit content
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
      e.target.value = ""; // reset so same file can be re-added
    }
  };

  const canSend = value.trim() || attachedFiles.length > 0;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-5 pt-10"
      style={{ background: "linear-gradient(to top, #080808 55%, transparent)" }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ══════════════════════════════════════════
            UNIFIED CONTAINER
            Structure (top → bottom):
              1. File chips area   (conditional, scrollable)
              2. Hairline divider  (only when chips exist)
              3. Textarea          (transparent, auto-grows)
              4. Hairline divider  (always)
              5. Toolbar           (icons + send)
        ══════════════════════════════════════════ */}
        <motion.form
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          onSubmit={onSubmit}
          className="flex flex-col rounded-2xl overflow-hidden"
          style={{
            background: "#161616",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
          }}
        >

          {/* ── 1 & 2. File chips + divider ──────────────────────────────── */}
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
                {/* Scrollable chips area — max 2 rows before scroll */}
                <div
                  className="flex flex-wrap gap-2 px-4 pt-3 pb-5 overflow-y-auto"
                  style={{
                    maxHeight: "112px",
                    scrollbarWidth: "none",
                  }}
                >
                  <AnimatePresence>
                    {attachedFiles.map((file) => (
                      <FileChip
                        key={file.id}
                        file={file}
                        onRemove={onRemoveFile}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Divider between chips and textarea
                <div
                  style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.05)",
                    margin: "0 16px",
                  }}
                /> */}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── 3. Textarea ──────────────────────────────────────────────── */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent px-4 pt-3.5 pb-2 outline-none resize-none text-white/80 placeholder-white/18 text-sm leading-relaxed"
            placeholder="Ask anything… (⌘K)"
            rows="1"
            style={{
              maxHeight: "180px",
              fontFamily: "'DM Sans', sans-serif",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          />

          {/* ── 4 & 5. Toolbar divider + icons ───────────────────────────── */}
          <div
            className="flex justify-between items-center px-3 pb-2.5 pt-1.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            {/* Left: attach + web */}
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
                className="p-2 rounded-lg text-white/22 hover:text-white/65 hover:bg-white/6 transition-all"
                title="Attach file"
              >
                <Paperclip size={15} />
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-white/22 hover:text-white/65 hover:bg-white/6 transition-all"
                title="Search web"
              >
                <Globe size={15} />
              </motion.button>
            </div>

            {/* Right: keyboard hint + send */}
            <div className="flex items-center gap-2">
              <span
                className="text-xs text-white/12 hidden sm:block"
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
                    ? { background: "rgba(255,255,255,0.9)", color: "#080808" }
                    : {
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }
                }
                aria-label="Send message"
              >
                <Send size={13} />
              </motion.button>
            </div>
          </div>
        </motion.form>

        <p
          className="text-center text-xs text-white/12 mt-2.5"
          style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.01em" }}
        >
          Perplexity can make mistakes — verify critical information
        </p>
      </div>
    </div>
  );
};

export default ChatInput;