# Google Sheets Order Monitoring Setup

Before customers go to WhatsApp, their contact details and order summary are automatically captured and stored in your Google Sheet for monitoring and follow-up.

---

## 2-Minute Quick Setup

### Step 1: Create a Google Sheet
1. Open [sheets.new](https://sheets.new) in your browser.
2. Name the sheet **"Pura Perfumes Orders"** (or any name you like).

### Step 2: Add the Apps Script Code
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any existing code in the editor.
3. Open [`google-apps-script.js`](./google-apps-script.js) from this repository, copy the entire code, and paste it into the editor.
4. Click the **Save** icon (disk icon).

### Step 3: Deploy as Web App
1. Click the blue **Deploy** button (top right) > **New deployment**.
2. Beside "Select type", click the **Gear icon ⚙** and select **Web app**.
3. Fill in the deployment details:
   - **Description**: `Pura Perfumes Order Logger`
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(Crucial so the website can send orders to it)*
4. Click **Deploy**.
5. If Google asks to authorize permissions:
   - Click *Authorize access*.
   - Choose your Google account.
   - Click *Advanced* > *Go to Untitled project (unsafe)* > *Allow*.
6. Copy the generated **Web app URL** (looks like `https://script.google.com/macros/s/.../exec`).

### Step 4: Add URL to `.env.local`
In the project root, open (or create) `.env.local` and add:

```env
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

Restart your dev server (`npm run dev`) or re-deploy.

---

## What Gets Stored in Your Google Sheet:
Every time a customer clicks to order, a new row is automatically added with:
- **Timestamp** (IST Date & Time)
- **Order ID** (e.g. `PUR-8291`)
- **Customer Name**
- **WhatsApp / Phone Number**
- **City & State**
- **Delivery Address**
- **Items Summary** (e.g. `Pura Symphony (100 ml) × 1 · Pura Obsidian (50 ml) × 1`)
- **Total Amount** (e.g. `₹2,798`)
- **Status** (`New (WhatsApp)`)
- **Customer Notes** (Special delivery notes)

---

## Fail-Safe Local Backup
Even if the Google Sheet URL is not yet added or Google is temporarily unreachable, all orders are also automatically saved locally to:
[`data/orders.json`](./data/orders.json)
Zero customer orders or leads are ever lost!
