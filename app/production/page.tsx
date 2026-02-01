"use client";

import { useState } from "react";

export default function ProductionCardSwitcher() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("Ready");
    const [logs, setLogs] = useState<string[]>([]);

    // Production Client ID
    const CLIENT_ID = process.env.NEXT_PUBLIC_KNOT_CLIENT_ID || "a390e79d-2920-4440-9ba1-b747bc92790b";

    // Form State
    const [formData, setFormData] = useState({
        userId: "user_prod_001",
        firstName: "Ada",
        lastName: "Lovelace",
        phone: "+12025550123",
        email: "ada@example.com",
        street: "100 Main St",
        city: "New York",
        state: "NY",
        zip: "10001",
        cardNumber: "",
        cvv: "",
        expMonth: "",
        expYear: ""
    });

    const addLog = (msg: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        let dataStr = "";
        try {
            if (data) dataStr = " " + JSON.stringify(data);
        } catch (e) {
            dataStr = " [Data Stringify Error]";
        }
        const fullMsg = `[${timestamp}] ${msg}${dataStr}`;
        console.log(fullMsg);
        setLogs(prev => [fullMsg, ...prev]);
        // Also update main status for summary
        if (!msg.startsWith("🔹") && !msg.startsWith("✅")) {
            setStatus(msg);
        }
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const performJWESwitch = async (taskId: string) => {
        try {
            addLog(`Connecting to Backend to encrypt JWE for Task: ${taskId}...`);

            const cardData = {
                user: {
                    name: { first_name: formData.firstName, last_name: formData.lastName },
                    phone_number: formData.phone,
                    address: {
                        street: formData.street,
                        city: formData.city,
                        region: formData.state,
                        postal_code: formData.zip,
                        country: "US"
                    }
                },
                card: {
                    number: formData.cardNumber,
                    expiration: `${formData.expMonth}/${formData.expYear}`,
                    cvv: formData.cvv
                }
            };

            const res = await fetch("/api/knot/create-session", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, cardData })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || `HTTP ${res.status}`);
            }

            const result = await res.json();
            addLog("✅ JWE Submitted Successfully to Knot API:", result);
            setStatus("Card switched successfully (Backend acknowledged).");

        } catch (e: any) {
            addLog("❌ JWE Switch Failed:", e.message);
            setStatus("Error: JWE Failed");
        }
    };

    const startFlow = async () => {
        setLoading(true);
        setLogs([]); // Clear logs
        setStatus("Initializing...");
        addLog("Starting Flow...");

        try {
            // 1. Create Session
            addLog("Creating Session...");
            const sessionRes = await fetch("/api/knot/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: formData.userId,
                    product: "card_switcher",
                    card_id: "card_ref_001"
                })
            });

            if (!sessionRes.ok) throw new Error("Session creation failed");
            const { session_id } = await sessionRes.json();
            addLog("Session Created:", session_id);

            // 2. Open SDK
            addLog("Loading SDK...");
            const KnotapiJS = (await import("knotapi-js")).default;
            const knot = new KnotapiJS();

            setStatus("Opening SDK...");
            knot.open({
                sessionId: session_id,
                clientId: CLIENT_ID,
                environment: "production",
                product: "card_switcher",
                entryPoint: "onboarding",
                useSearch: true,
                useCategories: true,
                onEvent: (eventData: any) => {
                    // Log Raw Event - full object to debug structure
                    addLog("🔹 SDK Event:", eventData);

                    // knotapi-js 1.0+ structure: eventData has direct properties
                    // eventData.event = "AUTHENTICATED"
                    // eventData.taskId = "task_xxx" (direct, NOT payload.task_id)
                    // eventData.metaData = { sendCard: true/false, ... }
                    const eventName = eventData?.event || eventData;
                    const taskId = eventData?.taskId || eventData?.task_id || eventData?.payload?.task_id;
                    const sendCard = eventData?.metaData?.sendCard;

                    addLog(`Parsed: event=${eventName}, taskId=${taskId}, sendCard=${sendCard}`);

                    if (eventName === "AUTHENTICATED" && taskId) {
                        addLog("⚡ Authenticated! Triggering JWE Switch (within 15s)...");
                        setStatus("Authenticating... Sending Card Data...");
                        performJWESwitch(taskId);
                    }
                },
                onSuccess: (data: any) => {
                    addLog("✅ SDK onSuccess:", data);
                    setStatus("Success! Flow Complete.");
                    setLoading(false);
                },
                onError: (err: any) => {
                    addLog("❌ SDK onError:", err);
                    setStatus("Error occurred in SDK behavior.");
                    setLoading(false);
                },
                onExit: () => {
                    addLog("👋 SDK onExit");
                    setStatus("Closed");
                    setLoading(false);
                }
            });

        } catch (e: any) {
            addLog("❌ Initialization Error:", e.message);
            setStatus("Error: " + e.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50 font-sans text-gray-800 flex flex-col md:flex-row gap-6">

            {/* Form / Controls */}
            <div className="flex-1 max-w-md bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-6 text-center">Output Card Switcher (Prod)</h1>

                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-mono">
                        Status: <strong>{status}</strong>
                    </div>

                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">User Details</div>
                    <div className="grid grid-cols-2 gap-4">
                        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="border p-2 rounded text-sm" />
                        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>
                    <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                    <input name="street" placeholder="Street" value={formData.street} onChange={handleChange} className="w-full border p-2 rounded text-sm" />
                    <div className="grid grid-cols-3 gap-2">
                        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border p-2 rounded text-sm" />
                        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border p-2 rounded text-sm" />
                        <input name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>

                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 mt-4">Card Details</div>
                    <input name="cardNumber" placeholder="Card Number" value={formData.cardNumber} onChange={handleChange} className="w-full border p-2 rounded text-sm font-mono" />
                    <div className="grid grid-cols-3 gap-2">
                        <input name="expMonth" placeholder="MM" value={formData.expMonth} onChange={handleChange} className="border p-2 rounded text-sm" />
                        <input name="expYear" placeholder="YYYY" value={formData.expYear} onChange={handleChange} className="border p-2 rounded text-sm" />
                        <input name="cvv" placeholder="CVV" value={formData.cvv} onChange={handleChange} className="border p-2 rounded text-sm" />
                    </div>

                    <button
                        onClick={startFlow}
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800 disabled:opacity-50 transition mt-6"
                    >
                        {loading ? "Processing..." : "Start Card Switch"}
                    </button>
                </div>
            </div>

            {/* Debug Log Console */}
            <div className="flex-1 bg-slate-900 text-green-400 p-4 rounded-lg shadow-md overflow-hidden flex flex-col h-[500px]">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Debug Console</div>
                <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1">
                    {logs.length === 0 && <span className="text-slate-600 italic">Logs will appear here...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="break-all border-b border-slate-800 pb-1">{log}</div>
                    ))}
                </div>
            </div>

        </div>
    );
}
