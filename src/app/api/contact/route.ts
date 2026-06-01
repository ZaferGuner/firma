import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/db/inquiries";

// Simple in-memory rate limiting map for basic spam protection
const rateLimitMap = new Map<string, { count: number; firstRequestTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 submissions per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  if (now - record.firstRequestTime > RATE_LIMIT_WINDOW) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true; // Rate limited
  }

  record.count += 1;
  return false;
}

// XSS protection: escape html characters
function escapeHTML(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    // Get IP address for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Explicitly destructure only allowed fields. Ignores id, status, source, createdAt etc.
    const { name, phone, email, subject, projectType, district, message } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: "Ad Soyad alanı zorunludur." }, { status: 400 });
    }

    if (!phone?.trim() && !email?.trim()) {
      return NextResponse.json({ error: "Telefon numarası veya e-posta adresi zorunludur." }, { status: 400 });
    }

    if (!subject?.trim()) {
      return NextResponse.json({ error: "Konu alanı zorunludur." }, { status: 400 });
    }
    
    if (message && message.length > 2000) {
      return NextResponse.json({ error: "Mesaj alanı en fazla 2000 karakter olabilir." }, { status: 400 });
    }

    // Allowed lists
    const allowedProjectTypes = ["Villa Projesi", "Konut Projesi", "Ticari Proje", "İç Mimari", "Diğer"];
    const validProjectType = allowedProjectTypes.includes(projectType) ? projectType : "Diğer";

    const allowedDistricts = ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan", "Kozan", "Karataş", "Yumurtalık", "Diğer", "Belirtilmedi"];
    const validDistrict = allowedDistricts.includes(district) ? district : "Belirtilmedi";

    // Clean data against XSS
    const cleanName = escapeHTML(name.trim());
    const cleanPhone = escapeHTML(phone?.trim() || "");
    const cleanEmail = escapeHTML(email?.trim() || "");
    const cleanSubject = escapeHTML(subject.trim());
    const cleanMessage = escapeHTML(message?.trim() || "");

    const combinedMessage = [
      `Konu: ${cleanSubject}`,
      `Proje türü: ${validProjectType}`,
      `Bölge: ${validDistrict}`,
      cleanMessage ? `Mesaj: ${cleanMessage}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    await createInquiry({
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      message: combinedMessage,
      source_page: "contact-form",
    });

    return NextResponse.json({ success: true, message: "Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz." });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Talebiniz işlenirken bir hata oluştu. Lütfen telefon veya WhatsApp üzerinden bize ulaşın." },
      { status: 500 }
    );
  }
}
