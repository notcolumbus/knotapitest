"use client";

import { useState, useEffect, useCallback } from "react";

interface Transaction {
    id?: string;
    merchant?: {
        id?: number;
        name?: string;
        logo?: string;
    };
    price?: {
        total?: string | number;
        currency?: string;
    };
    date?: string;
    status?: string;
    category?: string;
    description?: string;
}

/**
 * Transactions Component
 * Fetches and displays transactions from the Python Flask server
 */
export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [autoRefresh, setAutoRefresh] = useState(false);

    // Python server URL (Flask running on port 5001)
    const PYTHON_SERVER_URL = "http://localhost:5001";

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${PYTHON_SERVER_URL}/api/knot/webhook`, {
                method: "GET",
                headers: { "Accept": "application/json" },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setTransactions(data.transactions || []);
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch transactions");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Auto-refresh every 10 seconds if enabled
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(fetchTransactions, 10000);
        return () => clearInterval(interval);
    }, [autoRefresh, fetchTransactions]);

    const formatCurrency = (price?: { total?: string | number; currency?: string }) => {
        if (!price?.total) return "$0.00";
        const amount = typeof price.total === "string" ? parseFloat(price.total) : price.total;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency || "USD"
        }).format(amount);
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Unknown date";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            maxWidth: "700px",
            margin: "40px auto",
            padding: "24px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", margin: 0, color: "#333" }}>
                    📊 Transactions
                </h1>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <label style={{ fontSize: "12px", color: "#666", display: "flex", alignItems: "center", gap: "4px" }}>
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                        />
                        Auto-refresh
                    </label>
                    <button
                        onClick={fetchTransactions}
                        disabled={loading}
                        style={{
                            padding: "8px 16px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#fff",
                            backgroundColor: loading ? "#999" : "#28a745",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </div>
            </div>

            {lastUpdated && (
                <div style={{ fontSize: "11px", color: "#999", marginBottom: "16px" }}>
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
            )}

            {error && (
                <div style={{
                    marginBottom: "16px",
                    padding: "12px",
                    backgroundColor: "#fee",
                    border: "1px solid #fcc",
                    borderRadius: "4px",
                    color: "#c00",
                    fontSize: "13px"
                }}>
                    ⚠️ {error}
                </div>
            )}

            {transactions.length === 0 ? (
                <div style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "4px"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                    <div style={{ fontSize: "16px", fontWeight: "500" }}>No transactions yet</div>
                    <div style={{ fontSize: "13px", marginTop: "8px" }}>
                        Transactions will appear here when received via webhook
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {transactions.map((tx, index) => (
                        <div
                            key={tx.id || index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "16px",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "6px",
                                border: "1px solid #eee"
                            }}
                        >
                            {/* Merchant Logo */}
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "8px",
                                backgroundColor: "#ddd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "16px",
                                overflow: "hidden"
                            }}>
                                {tx.merchant?.logo ? (
                                    <img
                                        src={tx.merchant.logo}
                                        alt={tx.merchant.name || "Merchant"}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <span style={{ fontSize: "20px" }}>🏪</span>
                                )}
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "600", fontSize: "15px", color: "#333" }}>
                                    {tx.merchant?.name || "Unknown Merchant"}
                                </div>
                                <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                                    {formatDate(tx.date)}
                                    {tx.category && <span> • {tx.category}</span>}
                                </div>
                                {tx.description && (
                                    <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
                                        {tx.description}
                                    </div>
                                )}
                            </div>

                            {/* Amount */}
                            <div style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#333"
                            }}>
                                {formatCurrency(tx.price)}
                            </div>

                            {/* Status Badge */}
                            {tx.status && (
                                <div style={{
                                    marginLeft: "12px",
                                    padding: "4px 8px",
                                    fontSize: "10px",
                                    fontWeight: "600",
                                    textTransform: "uppercase",
                                    borderRadius: "4px",
                                    backgroundColor: tx.status === "completed" ? "#d4edda" : "#fff3cd",
                                    color: tx.status === "completed" ? "#155724" : "#856404"
                                }}>
                                    {tx.status}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div style={{
                marginTop: "24px",
                padding: "12px",
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#666"
            }}>
                <strong>Total:</strong> {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}
            </div>
        </div>
    );
}
