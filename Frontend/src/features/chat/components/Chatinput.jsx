import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.82, y: 2 }}
      transition={{ type: "spring", damping: 24, stiffness: 340 }}
      className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg shrink-0"
      style={{ background: "var(--border)", border: "1px solid var(--border)", maxWidth: "180px" }}
    >
      <div
        className="shrink-0 w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-[var(--bg-elevated)]"
      >
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[var(--text-tertiary)]">
            {isImage ? <ImageIcon size={14} /> : <FileText size={14} />}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-sans truncate leading-none mb-0.5 text-[var(--text-secondary)]">
          {file.name}
        </p>
        <p className="text-[10px] font-mono text-[var(--text-tertiary)]">
          {sizeLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="shrink-0 p-0.5 rounded transition-all text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
        aria-label={`Remove ${file.name}`}
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

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

  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6 pt-10"
      style={{ background: `linear-gradient(to top, var(--bg-base) 55%, transparent)` }}
    >
      <div className="max-w-[672px] mx-auto">
        <motion.form
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          onSubmit={onSubmit}
          className="flex flex-col rounded-3xl overflow-hidden"
          style={{ 
            background: "var(--glass-bg)", 
            backdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid var(--border)", 
            boxShadow: "0 12px 48px rgba(0,0,0,0.15)" 
          }}
        >
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
                  className="flex flex-wrap gap-2 px-4 pt-4 pb-1 overflow-y-auto"
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

          <div className="flex items-end px-2 py-2">
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
              className="p-3 mb-0.5 rounded-full transition-all text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)] shrink-0"
              title="Attach file"
              aria-label="Attach file"
            >
              <Paperclip size={20} />
            </motion.button>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-2 pt-4 pb-3 outline-none resize-none text-[15px] leading-relaxed font-sans text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
              placeholder="Ask Orchard anything..."
              rows="1"
              aria-label="Message input"
              style={{
                maxHeight: "180px",
                overflowY: "auto",
                scrollbarWidth: "none",
              }}
            />

            <motion.button
              type="submit"
              disabled={!canSend}
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              className="flex items-center justify-center w-10 h-10 mb-1 shrink-0 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed mx-2"
              style={
                canSend
                  ? { background: "var(--text-primary)", color: "var(--bg-base)" }
                  : { background: "var(--border)", color: "var(--text-tertiary)" }
              }
              aria-label="Send message"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </motion.form>

        <p className="text-center text-xs mt-3 font-mono text-[var(--text-tertiary)]">
          Orchard AI may produce inaccurate information.
        </p>
      </div>
    </div>
  );
};

export default ChatInput;