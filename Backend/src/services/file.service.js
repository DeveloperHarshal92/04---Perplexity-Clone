import ImageKit from "imagekit";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const processFile = async (file) => {
  const { buffer, mimetype, originalname } = file;

  // ── IMAGE → Upload to ImageKit ──
  if (mimetype.startsWith("image/")) {
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mimetype};base64,${base64}`;

    const uploaded = await imagekit.upload({
      file: buffer,
      fileName: originalname,
      folder: "/Perplexity/images/",
      useUniqueFileName: true,
    });

    return {
      strategy: "imagekit",
      url: uploaded.url,
      dataUrl,
      base64,
      fileId: uploaded.fileId,
      name: originalname,
      type: mimetype,
      aiContext: `The user shared an image. URL: ${uploaded.url} - analyze it if relevant.`,
    };
  }

  // ── PDF → Parse text locally ──
  if (mimetype === "application/pdf") {
    let extractedText = "Could not extract text from this PDF.";
    const parser = new PDFParse({ data: buffer });

    try {
      const parsed = await parser.getText();
      extractedText = parsed.text?.trim() || extractedText;
    } catch (err) {
      console.error("PDF parse failed", err);
    } finally {
      await parser.destroy();
    }

    return {
      strategy: "parsed",
      name: originalname,
      type: mimetype,
      rawText: extractedText,
      aiContext: `The user uploaded a PDF named "${originalname}". Content:\n\n${extractedText}`,
    };
  }

  // ── DOCX → Parse text locally ──
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype === "application/msword"
  ) {
    let extractedText = "Could not extract text from this document.";
    try {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value?.trim() || extractedText;
    } catch (err) {
      console.error("Word document parse failed", err);
    }

    return {
      strategy: "parsed",
      name: originalname,
      type: mimetype,
      rawText: extractedText,
      aiContext: `The user uploaded a Word document named "${originalname}". Content:\n\n${extractedText}`,
    };
  }

  // ── TXT → Read buffer directly ──
  if (mimetype === "text/plain") {
    const extractedText = buffer.toString("utf-8").trim();

    return {
      strategy: "parsed",
      name: originalname,
      type: mimetype,
      rawText: extractedText,
      aiContext: `The user uploaded a text file named "${originalname}". Content:\n\n${extractedText}`,
    };
  }

  // ── Fallback ──
  return {
    strategy: "unsupported",
    name: originalname,
    type: mimetype,
    rawText: "",
    aiContext: `The user uploaded a file named "${originalname}" but it could not be processed.`,
  };
};
