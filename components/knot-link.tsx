"use client";

import { useState, useCallback } from "react";
// @ts-ignore
import KnotapiJS from "knotapi-js";

export default function KnotLink() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userId, setUserId] = useState("prod_user_apple_tv_test");
    const [merchantId, setMerchantId] = useState(991);

    const clientId = process.env.NEXT_PUBLIC_KNOT_CLIENT_ID || "a390e79d-2920-4440-9ba1-b747bc92790b";

    const createSessionAndConnect = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Step 1: Create session via backend
            const response = await fetch("/api/knot/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    product: "transaction_link"
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to create session: ${data.error || response.statusText}`);
            }

            const sid = data.session_id || data.session;
            if (!sid) {
                throw new Error("Session ID not found in response");
            }

            setSessionId(sid);
            console.log("✅ Session created:", sid);

            // Step 2: Open Knot SDK - exactly like your working code
            const knotapi = new KnotapiJS();

            knotapi.open({
                sessionId: sid,
                clientId: clientId,
                environment: "production",
                product: "transaction_link",
                merchantIds: [merchantId],
                entryPoint: "onboarding",

                onSuccess: (product: any, details: any) => {
                    setLoading(false);
                    console.log("✅ Success:", details);
                    alert(`Successfully connected to ${details.merchantName || "merchant"}`);
                },
                onError: (product: any, errorCode: any, message: string) => {
                    console.error("❌ Knot Link error:", product, errorCode, message);
                    setError(`Error during Knot connection: ${message}`);
                    setLoading(false);
                },
                onExit: (product: any) => {
                    console.log("🚪 User exited the flow");
                    setLoading(false);
                },
                onEvent: (product: any, event: any, merchant: string, payload: any) => {
                    console.log("📨 Event:", product, event, merchant, payload);
                    if (event === 'MERCHANT_CONNECTED' || event === 'CONNECTION_SUCCESS' || event === 'SUCCESS') {
                        console.log("🎉 Connection event detected");
                    }
                },
            });
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to connect: " + (err instanceof Error ? err.message : String(err)));
            setLoading(false);
        }
    }, [userId, merchantId, clientId]);

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Knot SDK Integration</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">User ID</label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter user ID"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Merchant ID</label>
                <input
                    type="number"
                    value={merchantId}
                    onChange={(e) => setMerchantId(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="e.g. 991 for Apple TV"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Common: 44 (Amazon), 16 (Netflix), 19 (DoorDash), 991 (Apple TV)
                </p>
            </div>

            {sessionId && (
                <div className="mb-4 p-3 bg-gray-100 rounded">
                    <p className="text-xs font-mono break-all">Session: {sessionId}</p>
                </div>
            )}

            <div className="mb-4 text-sm">
                <p><strong>Environment:</strong> Development</p>
                <p><strong>Product:</strong> transaction_link</p>
            </div>

            <button
                onClick={createSessionAndConnect}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {loading ? "Connecting..." : "🚀 Connect with Knot"}
            </button>

            {error && (
                <p className="mt-4 text-red-600 text-sm">{error}</p>
            )}

            <p className="mt-4 text-xs text-gray-500 text-center">
                Set KNOT_CLIENT_SECRET in .env.local
            </p>
        </div>
    );
}
