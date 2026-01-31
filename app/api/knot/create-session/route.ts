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

        const product = body.product || "card_switcher";
        const cardId = body.card_id;

        // Get credentials from environment
        const clientId = process.env.KNOT_CLIENT_ID || "a390e79d-2920-4440-9ba1-b747bc92790b";
        const apiSecret = process.env.KNOT_CLIENT_SECRET || "your-secret-here";

        if (!apiSecret || apiSecret === "your-secret-here") {
            console.error("⚠️ KNOT_CLIENT_SECRET not set in environment");
            return NextResponse.json(
                { error: "Server configuration error: Missing API credentials" },
                { status: 500, headers: corsHeaders }
            );
        }

        // Create Basic Auth token
        const authToken = Buffer.from(`${clientId}:${apiSecret}`).toString("base64");

        // Knot API endpoint
        const apiUrl = "https://production.knotapi.com/session/create";

        // Create payload
        // For card_switcher, the type should be "link" according to Knot docs
        const payload: any = {
            external_user_id: userId,
            type: "link",
        };

        // Card switcher doesn't need card_id in session creation
        // The card details are collected during the SDK flow

        console.log("🔑 Creating Knot session:");
        console.log("  User ID:", userId);
        console.log("  Product:", product);
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
