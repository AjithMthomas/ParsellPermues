import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";

export interface OrderItem {
  name: string;
  size: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  city: string;
  address?: string;
  note?: string;
}

export interface OrderRequest {
  orderId?: string;
  createdAt?: string;
  customer: CustomerDetails;
  items: OrderItem[];
  itemsSummary: string;
  totalAmount: number;
  totalFormatted: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderRequest = await req.json();

    if (!body || !body.customer || !body.customer.name || !body.customer.phone) {
      return NextResponse.json(
        { error: "Customer name and phone number are required" },
        { status: 400 }
      );
    }

    const orderId = body.orderId || `PUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = body.createdAt || new Date().toISOString();

    const orderRecord = {
      orderId,
      timestamp,
      customer: {
        name: body.customer.name.trim(),
        phone: body.customer.phone.trim(),
        city: (body.customer.city || "").trim(),
        address: (body.customer.address || "").trim(),
        note: (body.customer.note || "").trim(),
      },
      items: body.items || [],
      itemsSummary: body.itemsSummary || "",
      totalAmount: body.totalAmount || 0,
      totalFormatted: body.totalFormatted || "",
      status: "New (WhatsApp)",
    };

    // 1. Always save to local backup file: data/orders.json
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const ordersFile = path.join(dataDir, "orders.json");
      let ordersList: any[] = [];
      if (fs.existsSync(ordersFile)) {
        try {
          const content = fs.readFileSync(ordersFile, "utf-8");
          ordersList = JSON.parse(content);
          if (!Array.isArray(ordersList)) ordersList = [];
        } catch {
          ordersList = [];
        }
      }
      ordersList.unshift(orderRecord);
      fs.writeFileSync(ordersFile, JSON.stringify(ordersList, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("[Orders] Failed to save local order backup:", fsErr);
    }

    // 2. Sync to Google Sheet if GOOGLE_SHEET_WEBHOOK_URL is configured
    let syncedToSheet = false;
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || site.googleSheetWebhookUrl;

    if (webhookUrl && webhookUrl.trim() !== "") {
      try {
        const sheetPayload = {
          orderId: orderRecord.orderId,
          timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          name: orderRecord.customer.name,
          phone: orderRecord.customer.phone,
          city: orderRecord.customer.city,
          address: orderRecord.customer.address,
          items: orderRecord.itemsSummary,
          total: orderRecord.totalFormatted,
          totalNumber: orderRecord.totalAmount,
          status: orderRecord.status,
          note: orderRecord.customer.note,
          rawItems: orderRecord.items,
        };

        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sheetPayload),
          redirect: "follow",
        });

        if (res.ok) {
          syncedToSheet = true;
        } else {
          console.warn("[GoogleSheet] Webhook returned status:", res.status);
        }
      } catch (sheetErr) {
        console.error("[GoogleSheet] Failed to sync order to Google Sheet:", sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: orderRecord.orderId,
      syncedToSheet,
    });
  } catch (err: any) {
    console.error("[API/Order] Error recording order:", err);
    return NextResponse.json(
      { error: "Failed to record order", details: err?.message },
      { status: 500 }
    );
  }
}
