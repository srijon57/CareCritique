// src/utils/translate.js
import translate from "google-translate-api";

export const translateText = async (text, target = "bn") => {
  try {
    const res = await translate(text, { to: target });
    return res.text;
  } catch (err) {
    console.error("Translation error:", err);
    return text; // fallback to original
  }
};
