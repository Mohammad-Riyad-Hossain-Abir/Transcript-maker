# 🎬 Transcript AI

YouTube ভিডিওর ট্রান্সক্রিপ্ট তৈরি করুন — বাংলা, উর্দু, আরবিসহ ১২টি ভাষায়।

## ⚙️ সেটআপ করুন

### ১. রিপো ক্লোন করুন
```bash
git clone https://github.com/আপনার-username/youtube-transcript.git
cd youtube-transcript
```

### ২. Dependencies ইন্সটল করুন
```bash
npm install
```

### ৩. API Key সেট করুন
`.env.example` ফাইলটা কপি করে `.env` নাম দিন:
```bash
cp .env.example .env
```
তারপর `.env` ফাইলে আপনার [Anthropic API Key](https://console.anthropic.com/) বসান:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

### ৪. রান করুন
```bash
npm run dev
```
ব্রাউজারে যান: `http://localhost:5173`

## 🚀 Build করুন
```bash
npm run build
```

## ⚠️ সতর্কতা
`.env` ফাইল কখনো GitHub-এ push করবেন না। `.gitignore`-এ ইতিমধ্যে যোগ করা আছে।
