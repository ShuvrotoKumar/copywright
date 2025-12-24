import { ConfigProvider, Table, Select, Tag } from "antd";
import { useMemo, useState } from "react";
import { IoSearch, IoChevronBack, IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function PaymentManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState();

    const [dataSource, setDataSource] = useState([
        {
            key: "1",
            transactionId: "TXN123456",
            customer: "John Doe",
            date: "2024-05-15",
            amount: 150.75,
            paymentMethod: "Credit Card",
            status: "Completed",
        },
        {
            key: "2",
            transactionId: "TXN123457",
            customer: "Emma Smith",
            date: "2024-05-14",
            amount: 89.99,
            paymentMethod: "PayPal",
            status: "Pending",
        },
        {
            key: "3",
            transactionId: "TXN123458",
            customer: "Liam Johnson",
            date: "2024-05-14",
            amount: 245.50,
            paymentMethod: "Bank Transfer",
            status: "Completed",
        },
        {
            key: "4",
            transactionId: "TXN123459",
            customer: "Olivia Brown",
            date: "2024-05-13",
            amount: 199.99,
            paymentMethod: "Credit Card",
            status: "Failed",
        },
        {
            key: "5",
            transactionId: "TXN123460",
            customer: "Noah Davis",
            date: "2024-05-12",
            amount: 75.25,
            paymentMethod: "PayPal",
            status: "Refunded",
        },
    ]);

    const columns = [
        {
            title: "No",
            key: "no",
            width: 70,
            render: (_, _r, index) => index + 1,
        },
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
            key: "transactionId",
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
            render: (_, record, index) => (
                <div className="flex items-center gap-3">
                    <img
                        src={`https://i.pravatar.cc/150?img=${index % 70 + 1}`}
                        className="w-10 h-10 object-cover rounded-full"
                        alt="Customer Avatar"
                    />
                    <span className="leading-none">{record.customer}</span>
                </div>
            ),
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `$${amount.toFixed(2)}`
        },
        {
            title: "Payment Method",
            dataIndex: "paymentMethod",
            key: "paymentMethod"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                let color = '';
                switch (status) {
                    case 'Completed':
                        color = 'green';
                        break;
                    case 'Pending':
                        color = 'orange';
                        break;
                    case 'Failed':
                        color = 'red';
                        break;
                    case 'Refunded':
                        color = 'blue';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
    ];

    const filteredData = useMemo(() => {
        const q = (searchQuery || "").toLowerCase().trim();
        return dataSource.filter((r) => {
            const matchStatus = statusFilter ? r.status === statusFilter : true;
            const matchQuery = q
                ? [r.transactionId, r.customer, r.paymentMethod, r.status, r.amount.toString()]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(q))
                : true;
            return matchStatus && matchQuery;
        });
    }, [dataSource, statusFilter, searchQuery]);

    return (
        <div className="p-5">
            <div className="bg-[#111826] px-5 py-3 rounded-md mb-3 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white hover:opacity-90 transition"
                >
                    <IoChevronBack className="w-6 h-6" />
                </button>
                <h1 className="text-white text-2xl font-bold">Payment Management</h1>
            </div>

            <div className="bg-white p-5 rounded-lg shadow">
                <div className="flex flex-col md:flex-row justify-end items-center gap-5 mb-5">
                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search payments..."
                                className="bg-white border border-gray-300 text-gray-900 pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#111826] w-full md:w-64"
                            />
                            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <ConfigProvider
                            theme={{
                                components: {
                                    Select: {
                                        colorPrimary: "[#111826]",
                                        colorPrimaryHover: "[#111826]",
                                        colorBorder: "#d1d5db",
                                        borderRadius: 6,
                                        colorText: "#111827",
                                        optionSelectedBg: "[#111826]",
                                        selectorBg: "[#111826]",
                                    },
                                },
                            }}
                        >
                            <Select
                                placeholder="Filter by status"
                                className="w-full md:w-48 size-22"
                                size="large"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                allowClear
                                options={[
                                    { label: "Completed", value: "Completed" },
                                    { label: "Pending", value: "Pending" },
                                    { label: "Failed", value: "Failed" },
                                    { label: "Refunded", value: "Refunded" },
                                ]}
                            />
                        </ConfigProvider>


                    </div>
                </div>

                <ConfigProvider
                    theme={{
                        components: {
                            Table: {
                                headerBg: "#f9fafb",
                                headerColor: "#111827",
                                borderColor: "#e5e7eb",
                                headerSplitColor: "#e5e7eb",
                                rowHoverBg: "#f9f5ff",
                                headerFontWeight: 800,
                            },
                            Pagination: {
                                colorPrimaryBorder: "#111827",
                                colorBorder: "#111827",
                                colorPrimaryHover: "#111827",
                                colorTextPlaceholder: "#111827",
                                itemActiveBgDisabled: "#111827",
                                colorPrimary: "#111827",
                            },
                        },
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{ pageSize: 10 }}
                        rowKey="key"
                        className="w-full"
                        scroll={{ x: true }}
                    />
                </ConfigProvider>
            </div>
        </div>
    );
}