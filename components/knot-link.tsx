"use client";

import { useState, useCallback, useEffect } from "react";

interface Product {
    external_id: string;
    name: string;
    description: string;
    quantity: number;
    price: { total: string; unit_price?: string; sub_total?: string };
    image_url: string;
    url?: string;
}

interface Transaction {
    id: string;
    external_id?: string;
    merchant: { name: string };
    datetime: string;
    url?: string;
    order_status: string;
    price: {
        total: string;
        currency: string;
        sub_total?: string;
        adjustments?: Array<{ type: string; label: string; amount: string }>;
    };
    products?: Product[];
    payment_methods?: Array<{
        type: string;
        brand: string;
        last_four: string;
        name?: string;
        transaction_amount?: string;
    }>;
}

export default function KnotLink() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [userId, setUserId] = useState("aman");
    const [product, setProduct] = useState("card_switcher");
    const [merchantId, setMerchantId] = useState(19); // DoorDash

    // Card states
    const [cardNumber, setCardNumber] = useState("");
    const [cardId, setCardId] = useState("card1");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvv, setCvv] = useState("");

    // User Profile for JWE (Mandatory in Prod)
    const [firstName, setFirstName] = useState("Ada");
    const [lastName, setLastName] = useState("Lovelace");
    const [street, setStreet] = useState("100 Main Street");
    const [city, setCity] = useState("New York");
    const [region, setRegion] = useState("NY");
    const [postalCode, setPostalCode] = useState("12345");
    const [phoneNumber, setPhoneNumber] = useState("+11234567890");

    // Toggle this to switch between development and production
    // IMPORTANT: For localhost testing, use 'development' (production requires domain whitelisting)
    const isDev = false; // PRODUCTION MODE
    const clientId = (isDev
        ? process.env.NEXT_PUBLIC_KNOT_CLIENT_ID_DEV
        : process.env.NEXT_PUBLIC_KNOT_CLIENT_ID) || "";
    const sdkEnvironment = isDev ? "development" : "production";

    const performJWESwitch = useCallback(async (taskId: string) => {
        try {
            const cardData = {
                user: {
                    name: { first_name: firstName, last_name: lastName },
                    address: {
                        street,
                        city,
                        region, // ISO 3166-2 (e.g., NY)
                        postal_code: postalCode,
                        country: "US"
                    },
                    phone_number: phoneNumber
                },
                card: {
                    number: cardNumber,
                    expiration: `${expMonth}/${expYear.length === 2 ? '20' + expYear : expYear}`,
                    cvv
                }
            };

            const response = await fetch("/api/knot/create-session", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId, cardData }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "JWE Switch failed");
            console.log("✅ JWE Switch Success:", data);
        } catch (err) {
            console.error("JWE Switch Error:", err);
            setError(err instanceof Error ? err.message : "JWE Switch failed");
        }
    }, [firstName, lastName, street, city, region, postalCode, phoneNumber, cardNumber, expMonth, expYear, cvv]);

    const createSessionAndConnect = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // POST to create session (REQUIRED card_id for production switcher)
            const response = await fetch("/api/knot/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: userId,
                    product,
                    card_id: cardId // Pass card_id here
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.details || "Failed to create session");

            const sid = data.session_id || data.session;
            setSessionId(sid);

            const KnotapiJS = (await import("knotapi-js")).default;
            const knotapi = new KnotapiJS();

            knotapi.open({
                sessionId: sid,
                clientId: clientId,
                environment: sdkEnvironment as any, // 'development' for localhost, 'production' for whitelisted domains
                product: product as any,
                merchantIds: [merchantId],
                entryPoint: "onboarding", // Recommended by docs for tracking + workflow
                useCategories: false, // Skip category selection screen
                onEvent: (eventData: any) => {
                    // knotapi-js v2 events usually come in an object { event: string, payload: any }
                    const { event, payload } = eventData || {};
                    console.log(`🔹 SDK Event: ${event}`, payload);
                    if (event === "AUTHENTICATED" && payload?.task_id) {
                        performJWESwitch(payload.task_id);
                    }
                },
                onSuccess: (successData: any) => {
                    console.log(`✅ Success:`, successData);
                    setLoading(false);
                },
                onError: (err: any) => {
                    setError(`SDK Error: ${JSON.stringify(err)}`);
                    setLoading(false);
                },
                onExit: () => setLoading(false),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connection failed");
            setLoading(false);
        }
    }, [userId, merchantId, clientId, product, cardId, performJWESwitch]);

    return (
        <div className="min-h-screen bg-[#FDFCF7] text-[#4A453E] font-sans p-4 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 border-b border-[#E8E4D8] pb-8">
                    <h1 className="text-4xl font-light tracking-tight mb-2 uppercase">Connectivity Hub</h1>
                    <p className="text-[#8C8675] text-sm tracking-wide">Secure merchant integration via JWE Production Flow</p>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-2xl space-y-8">
                        <section className="bg-[#F7F5EF] p-8 rounded-sm border border-[#E8E4D8] shadow-sm">
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-[#8C8675]">Parameters</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#A69F8B]">Account Information</h3>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase text-[#A69F8B] mb-1">User ID</label>
                                        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full p-2 bg-transparent border-b border-[#D1CDC0] outline-none text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase text-[#A69F8B] mb-1">Merchant</label>
                                        <select value={merchantId} onChange={(e) => setMerchantId(Number(e.target.value))} className="w-full p-2 bg-transparent border-b border-[#D1CDC0] outline-none text-sm">
                                            <option value={19}>DoorDash</option>
                                            <option value={44}>Amazon</option>
                                            <option value={16}>Netflix</option>
                                            <option value={911}>Instacart</option>
                                        </select>
                                    </div>
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#A69F8B] pt-4">User Profile (Required)</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-xs" />
                                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-xs" />
                                    </div>
                                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street Address" className="w-full p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-xs" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-xs" />
                                        <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="ST (e.g. NY)" className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-xs" />
                                    </div>
                                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone (E.164)" className="w-full p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-xs" />
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#A69F8B]">Card Details</h3>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase text-[#A69F8B] mb-1">Card ID</label>
                                        <input type="text" value={cardId} onChange={(e) => setCardId(e.target.value)} placeholder="e.g. card1" className="w-full p-2 bg-transparent border-b border-[#D1CDC0] outline-none text-sm" />
                                    </div>
                                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="Card Number" className="w-full p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-sm font-mono" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <input type="text" value={expMonth} onChange={(e) => setExpMonth(e.target.value)} placeholder="MM" maxLength={2} className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-sm" />
                                        <input type="text" value={expYear} onChange={(e) => setExpYear(e.target.value)} placeholder="YYYY" maxLength={4} className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-sm" />
                                        <input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="CVV" maxLength={4} className="p-2 border-b border-[#D1CDC0] bg-transparent outline-none text-sm" />
                                    </div>
                                    <div className="pt-12">
                                        <button
                                            onClick={createSessionAndConnect}
                                            disabled={loading}
                                            className="w-full py-4 bg-[#4A453E] hover:bg-[#36322C] text-[#FDFCF7] text-xs font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-30"
                                        >
                                            {loading ? "Connecting..." : "Start Production Flow"}
                                        </button>
                                    </div>
                                    {error && <div className="p-3 text-[10px] text-red-800 bg-red-50 italic border border-red-100">{error}</div>}
                                </div>
                            </div>
                        </section>

                        <div className="bg-[#4A453E] p-8 text-[#F7F5EF] rounded-sm">
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Session Status</span>
                                <div className={`h-1.5 w-1.5 rounded-full ${sessionId ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                            </div>
                            <div className="text-[10px] font-mono opacity-60 break-all">
                                {sessionId ? `SESSION_ID: ${sessionId}` : "AWAITING_INITIALIZATION"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
