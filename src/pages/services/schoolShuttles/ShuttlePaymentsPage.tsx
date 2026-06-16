import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toastManager } from "../../../utils/toastManager";
import { requireAal2 } from "../../../utils/stepUp";
import Modal from "../../../components/ui/Modal";

// Mock Data
const INITIAL_TRANSACTIONS = [
    { id: "TXN-001", student: "Emily Nakato", route: "Route A", amount: 150000, date: "2024-02-15", method: "Mobile Money", status: "completed" },
    { id: "TXN-002", student: "John Okello", route: "Route B", amount: 150000, date: "2024-02-14", method: "Cash", status: "completed" },
    { id: "TXN-003", student: "Sarah Mirembe", route: "Route A", amount: 150000, date: "2024-02-14", method: "Bank Transfer", status: "pending" },
    { id: "TXN-004", student: "David Kintu", route: "Route C", amount: 150000, date: "2024-02-13", method: "Mobile Money", status: "completed" },
    { id: "TXN-005", student: "Grace Nambi", route: "Route B", amount: 150000, date: "2024-02-12", method: "Cash", status: "failed" },
];

const INITIAL_OUTSTANDING = [
    { id: "INV-001", student: "Peter Ochieng", route: "Route C", amount: 150000, dueDate: "2024-02-01", daysOverdue: 15 },
    { id: "INV-002", student: "Mary Akello", route: "Route A", amount: 150000, dueDate: "2024-02-05", daysOverdue: 11 },
    { id: "INV-003", student: "James Opio", route: "Route B", amount: 75000, dueDate: "2024-02-10", daysOverdue: 6 },
];

export default function ShuttlePaymentsPage() {
    const [period, setPeriod] = useState("this-month");
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [newPayment, setNewPayment] = useState({ student: "", amount: "", method: "Mobile Money", date: new Date().toISOString().split('T')[0] });

    // Metrics
    const totalRevenue = transactions
        .filter(t => t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

    const outstandingAmount = INITIAL_OUTSTANDING.reduce((sum, i) => sum + i.amount, 0);
    const collectionRate = Math.round((totalRevenue / (totalRevenue + outstandingAmount)) * 100);

    const handleRecordPayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          await requireAal2();
        } catch (error) {
          if (error instanceof Error && error.message !== "AAL2 step-up required") {
            toastManager.show(error.message, "error");
          }
          return;
        }
        const payment = {
            id: `TXN-${Date.now()}`,
            student: newPayment.student,
            route: "Assigned Route", // Mock
            amount: parseInt(newPayment.amount) || 0,
            date: newPayment.date,
            method: newPayment.method,
            status: "completed"
        };

        setTransactions([payment, ...transactions]);
        setShowPaymentModal(false);
        setNewPayment({ student: "", amount: "", method: "Mobile Money", date: new Date().toISOString().split('T')[0] });
        toastManager.show("Payment recorded successfully!", "success");
    };

    return (
        <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 bg-slate-50 dark:bg-slate-900">
            <div className="w-full">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link
                            to="/school-shuttles"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-2 inline-block"
                        >
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Shuttle Payments</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Manage fees, track revenue, and record payments</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="px-4 py-2 rounded-xl bg-ev-green text-white text-sm font-medium shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition"
                        >
                            + Record Payment
                        </button>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Total Revenue</span>
                            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">💰</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                UGX {totalRevenue.toLocaleString()}
                            </span>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+12%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">This month</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Outstanding</span>
                            <span className="p-1.5 rounded-lg bg-red-100 text-red-600">⚠️</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                UGX {outstandingAmount.toLocaleString()}
                            </span>
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">3 Overdue</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Pending collection</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">Collection Rate</span>
                            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">📊</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {collectionRate}%
                            </span>
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">On Track</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Target: 95%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
                            <button className="text-sm text-ev-green hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Student</th>
                                        <th className="px-6 py-3">Route</th>
                                        <th className="px-6 py-3">Amount</th>
                                        <th className="px-6 py-3">Method</th>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {transactions.map((txn) => (
                                        <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{txn.student}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{txn.route}</td>
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                                UGX {txn.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{txn.method}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{txn.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                        txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {txn.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Outstanding */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-red-50/50 dark:bg-red-900/10 flex justify-between items-center">
                            <h2 className="font-semibold text-red-700 dark:text-red-400">Outstanding</h2>
                            <Link to="/school-shuttles/bulk-reminders" className="text-xs bg-white border border-red-200 text-red-600 px-2 py-1 rounded hover:bg-red-50">
                                Send Reminders
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {INITIAL_OUTSTANDING.map((item) => (
                                <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-slate-900 dark:text-white">{item.student}</span>
                                        <span className="font-semibold text-red-600">UGX {item.amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                        <span>{item.route}</span>
                                        <span className="text-red-500 font-medium">{item.daysOverdue} days overdue</span>
                                    </div>
                                </div>
                            ))}
                            {INITIAL_OUTSTANDING.length === 0 && (
                                <div className="p-8 text-center text-slate-500 text-sm">No outstanding payments</div>
                            )}
                        </div>
                    </div>
                </div>

                <Modal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    title="Record Payment"
                    size="md"
                >
                    <form onSubmit={handleRecordPayment} className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700 mb-1 block">Student Name *</span>
                            <input
                                type="text"
                                value={newPayment.student}
                                onChange={(e) => setNewPayment({ ...newPayment, student: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                required
                                placeholder="Search student..."
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700 mb-1 block">Amount (UGX) *</span>
                            <input
                                type="number"
                                value={newPayment.amount}
                                onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700 mb-1 block">Payment Method *</span>
                            <select
                                value={newPayment.method}
                                onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                            >
                                <option value="Mobile Money">Mobile Money</option>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-slate-700 mb-1 block">Date *</span>
                            <input
                                type="date"
                                value={newPayment.date}
                                onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ev-green"
                                required
                            />
                        </label>
                        <div className="flex gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 rounded-lg bg-ev-green text-white text-sm font-medium hover:bg-ev-green-dark"
                            >
                                Save Payment
                            </button>
                        </div>
                    </form>
                </Modal>
            </div>
        </div>
    );
}
