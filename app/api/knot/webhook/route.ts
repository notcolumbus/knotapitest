import { NextRequest, NextResponse } from "next/server";

// Simulating a database for transactions (in-memory for this demo)
let savedTransactions: any[] = [
    {
        id: "13da3c28-a068-4642-9ce2-b730cfda5f5f",
        merchant: { id: 19, name: "DoorDash" },
        datetime: new Date().toISOString(),
        order_status: "COMPLETED",
        payment_methods: [
            {
                type: "CARD",
                brand: "VISA",
                last_four: "5690",
                name: "Main Credit Card",
                transaction_amount: "43.20"
            }
        ],
        price: {
            sub_total: "43.69",
            adjustments: [
                { type: "TAX", label: "State Tax", amount: "3.88" },
                { type: "DISCOUNT", label: "Promo Code", amount: "-4.37" }
            ],
            total: "43.20",
            currency: "USD"
        },
        products: [
            {
                external_id: "10315643",
                name: "Band-Aid Variety Pack",
                description: "Assorted sizes for minor cuts.",
                quantity: 1,
                price: { total: "12.56" },
                image_url: "https://storage.googleapis.com/txn-product-images/doordash/33972462636.jpg"
            }
        ]
    }
];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📨 Received Knot Webhook:", body.event_type);

        if (body.event_type === "TRANSACTIONS_UPDATED") {
            if (body.transactions && Array.isArray(body.transactions)) {
                savedTransactions = [...body.transactions, ...savedTransactions];
            }
        }
        return NextResponse.json({ received: true });
    } catch (err) {
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const sync = searchParams.get("sync");
    const userId = searchParams.get("userId");
    const merchantId = searchParams.get("merchantId");
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit") || "5";

    // If sync=true, manually fetch from Knot API
    if (sync === "true" && userId && merchantId) {
        try {
            const clientId = process.env.KNOT_CLIENT_ID;
            const apiSecret = process.env.KNOT_CLIENT_SECRET;
            const authToken = Buffer.from(`${clientId}:${apiSecret}`).toString("base64");

            console.log(`🔄 API Pagination Sync: User: ${userId}, Merchant: ${merchantId}, Cursor: ${cursor}`);

            const response = await fetch("https://production.knotapi.com/transactions/sync", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Knot-Version": "2.0",
                    Authorization: `Basic ${authToken}`,
                },
                body: JSON.stringify({
                    external_user_id: userId,
                    merchant_id: parseInt(merchantId),
                    cursor: cursor || undefined,
                    limit: parseInt(limit),
                }),
            });

            const data = await response.json();

            if (data.transactions) {
                // If it's a new search (no cursor), we might want to clear or handle differently
                // For this demo, we'll just return the page and the next cursor
                return NextResponse.json({
                    transactions: data.transactions,
                    next_cursor: data.next_cursor,
                    synced: true
                });
            }
            return NextResponse.json(data);
        } catch (err) {
            console.error("Sync failed:", err);
            return NextResponse.json({ error: "Manual sync failed", details: err }, { status: 500 });
        }
    }

    // Default: return existing temp store (if any)
    return NextResponse.json({ transactions: savedTransactions });
}
