import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const FileChip = ({ file, onRemove }) => {
  const isImage = file.type?.startsWith("image/");
  const [thumb, setThumb] = useState(null);

  useEffect(() => {
    if (!isImage || !file.file) return;
    const url = URL.createObjectURL(file.file);
    setThumb(url);
    return () => URL.revokeObjectURL(url);
  }, [file.file, isImage]);

  const sizeLabel =
    file.size < 1024
      ? `${file.size} B`
      : file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 3 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 2 }}
      className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-lg shrink-0 bg-[#f0ede6] border border-[#d1d1cd]"
      style={{ maxWidth: "200px" }}
    >
      <div className="shrink-0 w-6 h-6 rounded-md overflow-hidden flex items-center justify-center bg-[#e4e1db]">
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#72706b] material-symbols-outlined text-[14px]">
            {isImage ? "image" : "description"}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[12px] truncate leading-none mb-0.5 text-[#27251e]">
          {file.name}
        </p>
        <p className="text-[10px] font-mono text-[#92918b]">
          {sizeLabel}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(file.id)}
        className="shrink-0 p-0.5 rounded text-[#92918b] hover:text-[#27251e] hover:bg-[#d1d1cd]/50 transition-colors"
        aria-label={`Remove ${file.name}`}
      >
        <span className="material-symbols-outlined text-[14px]">close</span>
      </button>
    </motion.div>
  );
};

const availableModels = [
  { id: "sonar-default", name: "Default (Sonar)", provider: "Perplexity", desc: "Fast, accurate web intelligence", badge: "DEFAULT" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", desc: "Advanced reasoning, coding & analysis", badge: "POPULAR" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "High speed multimodal knowledge" },
  { id: "o3-mini", name: "o3-mini", provider: "OpenAI", desc: "Deep STEM, mathematics & logic reasoning", badge: "REASONING" },
  { id: "gemini-2-flash", name: "Gemini 2.0 Flash", provider: "Google", desc: "Ultra-fast response & real-time search" },
];

const ChatInput = ({
  value,
  onChange,
  onSubmit,
  attachedFiles = [],
  onFileAttach,
  onRemoveFile,
  isLoading,
  selectedMode = "Search",
  onModeChange,
  onModelChange
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const modelMenuRef = useRef(null);
  
  const [mode, setMode] = useState(selectedMode || "Search");
  const [selectedModel, setSelectedModel] = useState(availableModels[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const modes = [
    { id: "Search", label: "Search", icon: "travel_explore" },
    { id: "Deep Research", label: "Deep Research", icon: "manage_search", badge: "PRO" },
    { id: "Reason", label: "Reason", icon: "psychology" },
  ];

  const handleSelectMode = (newMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setModelDropdownOpen(false);
    onModelChange?.(model);
    toast.success(`Switched to ${model.name}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target)) {
        setModelDropdownOpen(false);
      }
    };
    if (modelDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [modelDropdownOpen]);

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
      toast.error("Browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let currentBaseValue = value;

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening...", { icon: "🎙️" });
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

      const newValue = (currentBaseValue + " " + finalTranscript + interimTranscript).trim();
      onChange(newValue);
      
      if (finalTranscript) {
        currentBaseValue = (currentBaseValue + " " + finalTranscript).trim();
      }
      
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + "px";
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        toast.error("Microphone permission denied.");
      } else if (event.error !== 'aborted') {
        toast.error(`Speech recognition: ${event.error}`);
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
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (value.trim() || attachedFiles.length > 0)) {
        onSubmit(e);
        if (textareaRef.current) textareaRef.current.style.height = "42px";
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      onFileAttach?.(e.target.files);
      e.target.value = "";
    }
  };

  const canSend = value.trim().length > 0 || attachedFiles.length > 0;

  return (
    <div className="w-full flex flex-col justify-center px-4 pb-6 pt-2 sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/95 to-transparent z-20">
      <div className="w-full max-w-[760px] mx-auto">
        {/* Attached File Previews */}
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
                className="flex flex-wrap gap-2 pt-1 pb-1 overflow-y-auto custom-scrollbar"
                style={{ maxHeight: "96px" }}
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

        {/* Search Input Container with Scholar's Parchment styling */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading && canSend) {
              onSubmit(e);
              if (textareaRef.current) textareaRef.current.style.height = "42px";
            }
          }}
          className="bg-[#fdfbfa] border border-[#d1d1cd] rounded-[16px] card-subtle-shadow search-glow transition-all duration-200 p-3"
        >
          {/* Top Bar: Modes & Model Selector */}
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#d1d1cd]/50 relative">
            {/* Mode Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
              {modes.map((m) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMode(m.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] transition-all font-normal shrink-0 ${
                      active
                        ? "bg-[#016a71] text-white shadow-sm"
                        : "text-[#72706b] hover:text-[#27251e] hover:bg-[#f0ede6]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">{m.icon}</span>
                    <span>{m.label}</span>
                    {m.badge && (
                      <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                        active ? "bg-white/20 text-white" : "bg-[#016a71]/10 text-[#016a71]"
                      }`}>
                        {m.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Model Switcher Button */}
            <div className="relative" ref={modelMenuRef}>
              <button
                type="button"
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#d1d1cd] bg-[#faf8f5] hover:bg-[#f0ede6] text-[#27251e] text-[12px] font-normal transition-colors shrink-0"
                title="Switch AI model"
                aria-label="Switch AI model"
              >
                <span className="material-symbols-outlined text-[15px] text-[#016a71]">
                  tune
                </span>
                <span className="truncate max-w-[120px] sm:max-w-[150px] font-medium text-[12px]">
                  {selectedModel.name}
                </span>
                <span className="material-symbols-outlined text-[14px] text-[#72706b]">
                  {modelDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {/* Model Dropdown Menu (Opens upwards into open viewport) */}
              <AnimatePresence>
                {modelDropdownOpen && (
                  <>
                    {/* Invisible backdrop for reliable click-outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setModelDropdownOpen(false)} 
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 bottom-full mb-2 w-[280px] sm:w-[320px] max-w-[calc(100vw-32px)] bg-[#fdfbfa] border border-[#d1d1cd] rounded-2xl shadow-2xl z-50 p-2 card-subtle-shadow"
                      style={{
                        boxShadow: "0 12px 30px -4px rgba(0, 0, 0, 0.12), 0 8px 12px -6px rgba(0, 0, 0, 0.08)"
                      }}
                    >
                      <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#92918b] border-b border-[#d1d1cd]/50 mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-[#016a71]">tune</span>
                          <span>Select Model</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#016a71]/10 text-[#016a71] font-semibold">
                          {availableModels.length} models
                        </span>
                      </div>

                      <div className="space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar pr-0.5">
                        {availableModels.map((m) => {
                          const isSelected = selectedModel.id === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleSelectModel(m)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex flex-col gap-1 cursor-pointer ${
                                isSelected
                                  ? "bg-[#016a71]/10 text-[#016a71] border border-[#016a71]/20"
                                  : "hover:bg-[#f0ede6] text-[#27251e] border border-transparent"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[13px] font-medium leading-tight text-[#27251e]">
                                  {m.name}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {m.badge && (
                                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                                      isSelected
                                        ? "bg-[#016a71] text-white"
                                        : "bg-[#016a71]/15 text-[#016a71]"
                                    }`}>
                                      {m.badge}
                                    </span>
                                  )}
                                  {isSelected && (
                                    <span className="material-symbols-outlined text-[16px] text-[#016a71]">
                                      check_circle
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[11px] text-[#72706b] leading-tight line-clamp-1">
                                {m.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Text Area Body */}
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.csv,.json"
              disabled={isLoading}
            />

            <textarea 
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-[#27251e] placeholder:text-[#92918b] text-[15px] leading-relaxed py-1.5 resize-none max-h-[180px] min-h-[42px] disabled:opacity-50" 
              placeholder="Ask anything or search..." 
              rows="1"
            />

            {/* Action Buttons: Attach, Mic, Submit */}
            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              <button 
                type="button" 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0ede6] text-[#72706b] hover:text-[#27251e] transition-colors disabled:opacity-40"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file or image"
                disabled={isLoading}
                aria-label="Attach file"
              >
                <span className="material-symbols-outlined text-[18px]">attach_file</span>
              </button>

              <button 
                type="button" 
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
                  isListening 
                    ? "bg-[#93000a]/10 text-[#93000a] animate-pulse" 
                    : "hover:bg-[#f0ede6] text-[#72706b] hover:text-[#27251e]"
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
                disabled={isLoading}
                onClick={toggleListening}
                aria-label="Voice input"
              >
                <span className="material-symbols-outlined text-[18px]">{isListening ? "mic_off" : "mic"}</span>
              </button>
              
              {isLoading ? (
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#27251e] text-[#faf8f5] shrink-0">
                  <div className="w-2.5 h-2.5 rounded-sm bg-[#faf8f5] animate-pulse" />
                </div>
              ) : (
                <button 
                  type="submit"
                  disabled={!canSend}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all shrink-0 ${
                    canSend 
                      ? "bg-[#27251e] text-[#faf8f5] hover:bg-[#000000] active:scale-95 shadow-sm" 
                      : "bg-[#d1d1cd] text-[#faf8f5] cursor-not-allowed opacity-60"
                  }`}
                  aria-label="Submit query"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Micro helper text below input */}
        <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-[#92918b]">
          <div className="flex items-center gap-2">
            <span>Model: <span className="text-[#27251e] font-medium">{selectedModel.name}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span><kbd className="font-mono bg-[#f0ede6] px-1 py-0.5 rounded border border-[#d1d1cd]/60 text-[#72706b]">Enter ↵</kbd> search</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;