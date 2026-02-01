"use client";

import { useState, useCallback } from "react";

/**
 * Simple Vanilla Merchant Component
 * Takes client ID and merchant ID, then launches the Knot SDK
 */
export default function Merchants() {
    const [clientId, setClientId] = useState("");
    const [merchantId, setMerchantId] = useState("");
    const [userId, setUserId] = useState("test_user");
    const [cardId, setCardId] = useState("card1");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("Ready");

    // Python server URL (Flask running on port 5001)
    const PYTHON_SERVER_URL = "http://localhost:5001";

    const launchKnotSDK = useCallback(async () => {
        if (!clientId.trim()) {
            setError("Please enter a Client ID");
            return;
        }
        if (!merchantId.trim()) {
            setError("Please enter a Merchant ID");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setStatus("Creating session...");

            // Create session via Python Flask server
            const response = await fetch(`${PYTHON_SERVER_URL}/api/knot/create-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    product: "card_switcher",
                    card_id: cardId
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || data.error_message || "Failed to create session");
            }

            const sid = data.session_id || data.session;
            setSessionId(sid);
            setStatus("Session created, launching SDK...");

            // Dynamic import of Knot SDK
            const KnotapiJS = (await import("knotapi-js")).default;
            const knotapi = new KnotapiJS();

            knotapi.open({
                sessionId: sid,
                clientId: clientId,
                environment: "production",
                product: "card_switcher" as any,
                merchantIds: [parseInt(merchantId)],
                entryPoint: "test",
                onEvent: (eventData: any) => {
                    console.log("🔹 SDK Event:", eventData);
                    setStatus(`Event: ${JSON.stringify(eventData)}`);
                },
                onSuccess: (successData: any) => {
                    console.log("✅ Success:", successData);
                    setStatus("Success!");
                    setLoading(false);
                },
                onError: (err: any) => {
                    console.error("❌ Error:", err);
                    setError(`SDK Error: ${JSON.stringify(err)}`);
                    setLoading(false);
                },
                onExit: () => {
                    setStatus("SDK closed");
                    setLoading(false);
                },
            });
        } catch (err) {
            console.error("Launch error:", err);
            setError(err instanceof Error ? err.message : "Failed to launch SDK");
            setLoading(false);
        }
    }, [clientId, merchantId, userId, cardId]);

    return (
        <div style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            maxWidth: "500px",
            margin: "40px auto",
            padding: "24px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ fontSize: "24px", marginBottom: "24px", color: "#333" }}>
                🔗 Knot Merchant Launcher
            </h1>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px" }}>
                    Client ID
                </label>
                <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="a390e79d-2920-4440-9ba1-..."
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "14px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px" }}>
                    Merchant ID
                </label>
                <input
                    type="text"
                    value={merchantId}
                    onChange={(e) => setMerchantId(e.target.value)}
                    placeholder="19 (DoorDash), 44 (Amazon), 16 (Netflix)..."
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "14px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px" }}>
                    User ID
                </label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="test_user"
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "14px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#666", marginBottom: "4px" }}>
                    Card ID
                </label>
                <input
                    type="text"
                    value={cardId}
                    onChange={(e) => setCardId(e.target.value)}
                    placeholder="card1"
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: "14px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        boxSizing: "border-box"
                    }}
                />
            </div>

            <button
                onClick={launchKnotSDK}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#fff",
                    backgroundColor: loading ? "#999" : "#007bff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: loading ? "not-allowed" : "pointer"
                }}
            >
                {loading ? "Loading..." : "Launch Knot SDK"}
            </button>

            {error && (
                <div style={{
                    marginTop: "16px",
                    padding: "12px",
                    backgroundColor: "#fee",
                    border: "1px solid #fcc",
                    borderRadius: "4px",
                    color: "#c00",
                    fontSize: "13px"
                }}>
                    {error}
                </div>
            )}

            <div style={{
                marginTop: "16px",
                padding: "12px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "monospace"
            }}>
                <strong>Status:</strong> {status}
                {sessionId && (
                    <div style={{ marginTop: "8px", wordBreak: "break-all" }}>
                        <strong>Session:</strong> {sessionId}
                    </div>
                )}
            </div>
        </div>
    );
}
