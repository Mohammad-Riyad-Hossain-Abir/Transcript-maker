// v3
import { useState, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "tr", label: "Turkish", native: "Türkçe" },
];

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function App() {
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("en");
  const [translateTo, setTranslateTo] = useState("bn");
  const [shouldTranslate, setShouldTranslate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const transcriptRef = useRef(null);

  const handleGenerate = async () => {
    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError("সঠিক YouTube লিংক দিন।");
      return;
    }
    setLoading(true);
    setTranscript(null);
    setError(null);

    const selectedLang = LANGUAGES.find((l) => l.code === lang);
    const translateLang = LANGUAGES.find((l) => l.code === translateTo);

    const prompt = shouldTranslate
      ? `You are a YouTube transcript extractor. The YouTube video ID is: ${videoId}
         The video URL is: https://www.youtube.com/watch?v=${videoId}
         
         Please search the web and:
         1. Find information about this YouTube video
         2. Get or reconstruct the transcript/content of this video in ${selectedLang?.label} language
         3. Then translate the full transcript to ${translateLang?.label} (${translateLang?.native})
         
         Format your response as:
         VIDEO TITLE: [title]
         ORIGINAL LANGUAGE: ${selectedLang?.label}
         TRANSLATED TO: ${translateLang?.label}
         
         TRANSCRIPT (${translateLang?.native}):
         [Full translated transcript here, paragraph by paragraph]
         
         Be thorough and include as much of the content as possible.`
      : `You are a YouTube transcript extractor. The YouTube video ID is: ${videoId}
         The video URL is: https://www.youtube.com/watch?v=${videoId}
         
         Please search the web and:
         1. Find information about this YouTube video
         2. Get or reconstruct the transcript/content of this video in ${selectedLang?.label} language
         
         Format your response as:
         VIDEO TITLE: [title]
         LANGUAGE: ${selectedLang?.label}
         
         TRANSCRIPT:
         [Full transcript here, paragraph by paragraph, preserving the original language]
         
         Be thorough and include as much of the video content as possible.`;

    try {
      const raw = import.meta.env.VITE_GEMINI_API_KEY || '';
const apiKey = raw.startsWith('AIza') ? raw : atob(raw);
      if (!apiKey) {
        setError(".env ফাইলে VITE_GEMINI_API_KEY সেট করুন।");
        setLoading(false);
        return;
      }

      const res = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "user", content: prompt }],
    }),
  }
);

const data = await res.json();
if (data.error) throw new Error(data.error.message);

const fullText = data.choices?.[0]?.message?.content || "কোনো ট্রান্সক্রিপ্ট পাওয়া যায়নি।";
      setTranscript(fullText);
    } catch (e) {
      setError("ট্রান্সক্রিপ্ট আনতে সমস্যা হয়েছে: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#e8e0d0",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2a2a3a",
        padding: "28px 40px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
      }}>
        <div style={{
          width: 42, height: 42,
          background: "linear-gradient(135deg, #e63946, #c1121f)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          boxShadow: "0 0 20px rgba(230,57,70,0.4)",
        }}>▶</div>
        <div>
          <div style={{ fontSize: 22, fontWeight: "bold", letterSpacing: "0.5px", color: "#fff" }}>
            Transcript AI
          </div>
          <div style={{ fontSize: 12, color: "#888", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "monospace" }}>
            YouTube • Multi-language
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 38,
            fontWeight: "bold",
            lineHeight: 1.2,
            marginBottom: 12,
            background: "linear-gradient(135deg, #ffffff 30%, #e63946)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            যেকোনো ভিডিওর<br />ট্রান্সক্রিপ্ট তৈরি করুন
          </div>
          <div style={{ color: "#888", fontSize: 15, lineHeight: 1.7 }}>
            বাংলা, উর্দু, আরবি সহ ১২টি ভাষায় ট্রান্সক্রিপ্ট ও অনুবাদ
          </div>
        </div>

        {/* Input Card */}
        <div style={{
          background: "#13131f",
          border: "1px solid #2a2a3a",
          borderRadius: 16,
          padding: "32px",
          marginBottom: 24,
        }}>
          {/* URL Input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: "#888", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
              YouTube লিংক
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                width: "100%",
                background: "#0a0a0f",
                border: "1px solid #2a2a3a",
                borderRadius: 10,
                padding: "13px 16px",
                color: "#e8e0d0",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => e.target.style.borderColor = "#e63946"}
              onBlur={(e) => e.target.style.borderColor = "#2a2a3a"}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          {/* Language Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#888", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
                ভিডিওর ভাষা
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0a0a0f",
                  border: "1px solid #2a2a3a",
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: "#e8e0d0",
                  fontSize: 14,
                  outline: "none",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.native} — {l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#888", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "monospace", marginBottom: 8 }}>
                অনুবাদের ভাষা
              </label>
              <select
                value={translateTo}
                onChange={(e) => setTranslateTo(e.target.value)}
                style={{
                  width: "100%",
                  background: "#0a0a0f",
                  border: "1px solid #2a2a3a",
                  borderRadius: 10,
                  padding: "12px 14px",
                  color: "#e8e0d0",
                  fontSize: 14,
                  outline: "none",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.native} — {l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Translate Toggle */}
          <div
            onClick={() => setShouldTranslate(!shouldTranslate)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              padding: "10px 14px",
              borderRadius: 8,
              background: shouldTranslate ? "rgba(230,57,70,0.1)" : "transparent",
              border: `1px solid ${shouldTranslate ? "rgba(230,57,70,0.3)" : "#2a2a3a"}`,
              marginBottom: 20,
              transition: "all 0.2s",
              userSelect: "none",
            }}
          >
            <div style={{
              width: 40, height: 22,
              background: shouldTranslate ? "#e63946" : "#2a2a3a",
              borderRadius: 11,
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                top: 3, left: shouldTranslate ? 21 : 3,
                width: 16, height: 16,
                background: "#fff",
                borderRadius: "50%",
                transition: "left 0.2s",
              }} />
            </div>
            <span style={{ fontSize: 14, color: shouldTranslate ? "#e8e0d0" : "#888" }}>
              অন্য ভাষায় অনুবাদ করতে চাই
            </span>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !url.trim()}
            style={{
              width: "100%",
              padding: "15px",
              background: loading || !url.trim()
                ? "#2a2a3a"
                : "linear-gradient(135deg, #e63946, #c1121f)",
              border: "none",
              borderRadius: 10,
              color: loading || !url.trim() ? "#666" : "#fff",
              fontSize: 16,
              fontWeight: "bold",
              cursor: loading || !url.trim() ? "not-allowed" : "pointer",
              letterSpacing: "0.5px",
              transition: "all 0.2s",
              boxShadow: loading || !url.trim() ? "none" : "0 4px 20px rgba(230,57,70,0.35)",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <span style={{
                  display: "inline-block",
                  width: 16, height: 16,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                ট্রান্সক্রিপ্ট তৈরি হচ্ছে...
              </span>
            ) : "ট্রান্সক্রিপ্ট তৈরি করুন"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(230,57,70,0.1)",
            border: "1px solid rgba(230,57,70,0.3)",
            borderRadius: 10,
            padding: "14px 18px",
            color: "#e63946",
            fontSize: 14,
            marginBottom: 24,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Transcript Output */}
        {transcript && (
          <div style={{
            background: "#13131f",
            border: "1px solid #2a2a3a",
            borderRadius: 16,
            overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid #2a2a3a",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#0d0d1a",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: "#e63946",
                  boxShadow: "0 0 8px rgba(230,57,70,0.6)",
                }} />
                <span style={{ fontSize: 12, color: "#888", fontFamily: "monospace", letterSpacing: "1px", textTransform: "uppercase" }}>
                  ট্রান্সক্রিপ্ট
                </span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "#2a2a3a"}`,
                  borderRadius: 7,
                  padding: "6px 14px",
                  color: copied ? "#22c55e" : "#888",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "monospace",
                  letterSpacing: "0.5px",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ কপি হয়েছে" : "কপি করুন"}
              </button>
            </div>

            <div
              ref={transcriptRef}
              style={{
                padding: "28px",
                maxHeight: 480,
                overflowY: "auto",
                lineHeight: 1.9,
                fontSize: 15,
                color: "#d4cec4",
                whiteSpace: "pre-wrap",
                fontFamily: "'Georgia', serif",
              }}
            >
              {transcript.split("\n").map((line, i) => {
                const isBold = line.startsWith("VIDEO TITLE:") || line.startsWith("LANGUAGE:") || line.startsWith("TRANSCRIPT") || line.startsWith("ORIGINAL") || line.startsWith("TRANSLATED");
                return (
                  <div key={i} style={{
                    color: isBold ? "#fff" : "#d4cec4",
                    fontWeight: isBold ? "bold" : "normal",
                    fontSize: isBold ? 13 : 15,
                    letterSpacing: isBold ? "0.5px" : "normal",
                    fontFamily: isBold ? "monospace" : "'Georgia', serif",
                    marginBottom: line === "" ? 8 : 2,
                  }}>
                    {line || "\u00A0"}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips */}
        {!transcript && !loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginTop: 8,
          }}>
            {[
              { icon: "🌐", title: "১২টি ভাষা", desc: "বাংলা, উর্দু, আরবি, হিন্দিসহ" },
              { icon: "🔄", title: "সরাসরি অনুবাদ", desc: "যেকোনো ভাষায় রূপান্তর করুন" },
              { icon: "📋", title: "কপি করুন", desc: "এক ক্লিকে সব টেক্সট কপি" },
            ].map((item) => (
              <div key={item.title} style={{
                background: "#13131f",
                border: "1px solid #2a2a3a",
                borderRadius: 12,
                padding: "18px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select option { background: #13131f; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 3px; }
      `}</style>
    </div>
  );
}
