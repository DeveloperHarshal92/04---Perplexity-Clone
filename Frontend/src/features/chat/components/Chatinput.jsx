import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

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
      className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-lg shrink-0 bg-surface-container border border-white/5"
      style={{ maxWidth: "180px" }}
    >
      <div className="shrink-0 w-7 h-7 rounded-md overflow-hidden flex items-center justify-center bg-surface-variant">
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-on-surface-variant material-symbols-outlined text-[14px]">
            {isImage ? "image" : "description"}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-sans truncate leading-none mb-0.5 text-on-surface-variant">
          {file.name}
        </p>
        <p className="text-[10px] font-label-mono text-outline">
          {sizeLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="shrink-0 p-0.5 rounded transition-all text-outline hover:text-on-surface hover:bg-white/5"
        aria-label={`Remove ${file.name}`}
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
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
  isLoading
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let currentBaseValue = value; // Capture the value at the start of recognition

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // Update the main value with what we had + new final + interim
      const newValue = (currentBaseValue + " " + finalTranscript + interimTranscript).trim();
      onChange(newValue);
      
      // Update base value if we got final text, so next interim appends correctly
      if (finalTranscript) {
        currentBaseValue = (currentBaseValue + " " + finalTranscript).trim();
      }
      
      // Auto adjust height
      if (textareaRef.current) {
         textareaRef.current.style.height = "auto";
         textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        toast.error("Microphone permission denied.");
      } else if (event.error !== 'aborted') {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      toast.error("Could not start speech recognition.");
    }
  };

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
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit(e);
        if (textareaRef.current) textareaRef.current.style.height = "44px";
      }
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
    <div className="w-full flex flex-col justify-center p-md pb-lg absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/80 to-transparent">
      <div className="w-full max-w-[672px] mx-auto">
        <AnimatePresence initial={false}>
          {attachedFiles.length > 0 && (
            <motion.div
              key="chips-zone"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-2"
            >
              <div
                className="flex flex-wrap gap-2 pt-2 pb-1 overflow-y-auto custom-scrollbar"
                style={{ maxHeight: "112px" }}
              >
                <AnimatePresence>
                  {attachedFiles.map((file) => (
                    <FileChip key={file.id} file={file} onRemove={onRemoveFile} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={(e) => {
          e.preventDefault();
          if (!isLoading) {
            onSubmit(e);
            if (textareaRef.current) textareaRef.current.style.height = "44px";
          }
        }}>
          <div className="glass-bg w-full rounded-2xl flex items-end p-[12px] gap-sm transition-all shadow-2xl !border-none outline-none">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
              disabled={isLoading}
            />
            <button 
              type="button" 
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-on-surface-variant transition-colors shrink-0 disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              title="Attach File"
              disabled={isLoading}
            >
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea 
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-on-surface placeholder:text-outline py-2 resize-none max-h-[200px] min-h-[44px] disabled:opacity-50" 
              placeholder="Ask Orchard anything..." 
              rows="1"
            ></textarea>
            <button 
              type="button" 
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors shrink-0 disabled:opacity-50 ${
                isListening ? "bg-error/20 text-error animate-pulse" : "hover:bg-white/10 text-on-surface-variant"
              }`}
              title="Voice Input"
              disabled={isLoading}
              onClick={toggleListening}
            >
              <span className="material-symbols-outlined">{isListening ? "mic_off" : "mic"}</span>
            </button>
            
            {isLoading ? (
              <button 
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-variant text-on-surface-variant hover:brightness-110 transition-all shadow-lg active:scale-95 shrink-0"
                title="Stop generating"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!canSend}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container hover:brightness-110 transition-all shadow-lg active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;