import { NextResponse } from "next/server";

// CORS headers
const getCorsHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
});

export async function OPTIONS() {
    return NextResponse.json({}, { headers: getCorsHeaders() });
}

export async function POST(request: Request) {
    const corsHeaders = getCorsHeaders();

    try {
        const body = await request.json();
        const userId = body.user_id || body.userId;

        if (!userId) {
            return NextResponse.json(
                { error: "Missing user_id in request body" },
                { status: 400, headers: corsHeaders }
            );
        }

        const product = body.product || "transaction_link";
        const cardId = body.card_id;
        const card = body.card; // New: Full card object support

        // Toggle: Set to true for development (localhost testing), false for production
        const isDev = false; // PRODUCTION MODE

        // Knot API endpoint and credentials based on environment
        const apiUrl = isDev
            ? "https://development.knotapi.com/session/create"
            : "https://production.knotapi.com/session/create";
        const clientId = isDev
            ? process.env.KNOT_CLIENT_ID_DEV
            : process.env.KNOT_CLIENT_ID;
        const apiSecret = isDev
            ? process.env.KNOT_CLIENT_SECRET_DEV
            : process.env.KNOT_CLIENT_SECRET;

        if (!apiSecret) {
            console.error(`⚠️ KNOT_CLIENT_SECRET not set in environment`);
            return NextResponse.json(
                { error: "Server configuration error: Missing API credentials" },
                { status: 500, headers: corsHeaders }
            );
        }

        // Create Basic Auth token
        const authToken = Buffer.from(`${clientId}:${apiSecret}`).toString("base64");

        // Create payload - Clean for Production
        const payload: any = {
            external_user_id: userId,
            type: product,
        };

        // For card_switcher, card_id is often required even with JWE
        if (product === "card_switcher" && cardId) {
            payload.card_id = cardId;
        }

        // Note: In Production, card data should NOT be sent in session create.
        // It must be sent via Switch Card (JWE) after authentication.

        console.log("🔑 Creating Knot session:");
        console.log("  User ID:", userId);
        console.log("  Product:", product);
        if (payload.card_id) console.log("  Card ID:", payload.card_id);
        console.log("  Payload:", JSON.stringify(payload));
        console.log("  API URL:", apiUrl);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "Knot-Version": "2.0",
                Authorization: `Basic ${authToken}`,
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();
        console.log("📥 Knot API Response Status:", response.status);
        console.log("📥 Knot API Response:", responseText);
        let responseData;

        try {
            responseData = response.status !== 204 ? JSON.parse(responseText) : {};
        } catch (e) {
            console.error("Error parsing response:", e);
            responseData = { error: "Invalid response format" };
        }

        if (!response.ok) {
            console.error("❌ Knot API error:", responseData);
            return NextResponse.json(
                {
                    error: "Failed to create Knot session",
                    details: responseData?.error || response.statusText,
                    status: response.status,
                },
                { status: response.status, headers: corsHeaders }
            );
        }

        // Standardize response
        if (responseData.session && !responseData.session_id) {
            responseData.session_id = responseData.session;
        }

        console.log("✅ Session created:", responseData.session_id);

        return NextResponse.json(responseData, { headers: corsHeaders });
    } catch (error) {
        console.error("Error creating Knot session:", error);
        return NextResponse.json(
            {
                error: "Failed to create Knot session",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500, headers: corsHeaders }
        );
    }
}

// --- NEW: JWE Card Switch Endpoint ---
import { CompactEncrypt, importJWK } from 'jose';

export async function PUT(request: Request) {
    const corsHeaders = getCorsHeaders();
    try {
        const body = await request.json();
        const { taskId, cardData } = body;

        if (!taskId || !cardData) {
            return NextResponse.json({ error: "Missing taskId or cardData" }, { status: 400, headers: corsHeaders });
        }

        // Toggle: Match the same environment as session creation
        const isDev = false; // PRODUCTION MODE
        const baseUrl = isDev ? "https://development.knotapi.com" : "https://production.knotapi.com";
        const clientId = isDev ? process.env.KNOT_CLIENT_ID_DEV : process.env.KNOT_CLIENT_ID;
        const apiSecret = isDev ? process.env.KNOT_CLIENT_SECRET_DEV : process.env.KNOT_CLIENT_SECRET;
        const authToken = Buffer.from(`${clientId}:${apiSecret}`).toString("base64");

        // 1. Get JWK from Knot
        const keyResponse = await fetch(`${baseUrl}/jwe/key`, {
            method: 'GET',
            headers: { Authorization: `Basic ${authToken}`, Accept: 'application/json' },
        });

        if (!keyResponse.ok) {
            throw new Error(`Failed to fetch JWK: ${keyResponse.statusText}`);
        }
        const jwk = await keyResponse.json();

        // 2. Encrypt Data
        const alg = jwk.alg;
        const publicKey = await importJWK(jwk, alg);
        const plaintext = new TextEncoder().encode(JSON.stringify(cardData));

        const jwe = await new CompactEncrypt(plaintext)
            .setProtectedHeader({
                alg,
                enc: 'A256GCM',
                ...(jwk.kid ? { kid: jwk.kid } : {}),
            })
            .encrypt(publicKey);

        // 3. Submit JWE to Knot
        const submitResponse = await fetch(`${baseUrl}/card`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${authToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({ task_id: taskId, jwe }),
        });

        const result = await submitResponse.json();
        if (!submitResponse.ok) {
            return NextResponse.json({ error: result.error_message || "Switch failed" }, { status: submitResponse.status, headers: corsHeaders });
        }

        return NextResponse.json(result, { headers: corsHeaders });
    } catch (err) {
        console.error("JWE Switch Error:", err);
        return NextResponse.json({ error: err instanceof Error ? err.message : "JWE execution failed" }, { status: 500, headers: corsHeaders });
    }
}
