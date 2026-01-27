import { ConfigProvider, Modal, Table } from "antd";
import { useState, useMemo } from "react";
import { IoSearch, IoChevronBack, IoDocumentTextOutline, IoTrash } from "react-icons/io5";
import { FaRegEye, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetAllTransactionsQuery } from "../../redux/api/invoicesApi";
import dayjs from "dayjs";
import html2pdf from "html2pdf.js";

function Invoices() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetAllTransactionsQuery();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);

  const transactions = useMemo(() => {
    if (!data?.data?.transactions) return [];
    return Array.isArray(data.data.transactions) ? data.data.transactions : [];
  }, [data]);

  const dataSource = useMemo(() => {
    return transactions.map(t => ({
      key: t.transactionId,
      invoiceNo: t.transactionId,
      customer: t.customerName || 'N/A',
      email: t.customerEmail || 'N/A',
      amount: t.amount,
      date: t.orderDate,
      status: t.status,
    }));
  }, [transactions]);

  const columns = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: "Customer",
      key: "customer",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-[#111826] font-semibold">
              {record.customer.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="leading-none font-medium">{record.customer}</span>
            <span className="text-gray-500 text-sm">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <button
            onClick={() => showViewModal(record)}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="View Invoice"
          >
            <FaRegEye className="text-gray-600 w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownloadPdf(record);
            }}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Download PDF"
          >
            <FaFilePdf className="text-red-500 w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  const showViewModal = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const showDeleteModal = (invoice) => {
    setInvoiceToDelete(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteInvoice = () => {
    console.log('Deleting invoice:', invoiceToDelete?.invoiceNo);
    setIsDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return 'background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; display: inline-block;';
    } else if (status === 'pending') {
      return 'background: #fef3c7; color: #854d0e; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; display: inline-block;';
    } else {
      return 'background: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; display: inline-block;';
    }
  };

  const handleDownloadPdf = async (invoice) => {
    const container = document.createElement("div");

    const invoiceDate = invoice?.date
      ? dayjs(invoice.date).format("DD MMMM YYYY")
      : "N/A";

    container.innerHTML = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 32px; color: #111827; max-width: 800px; margin: 0 auto;">
        
        <!-- Header Section (Blue background) -->
        <div style="background: #dbeafe; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h3 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px 0;">#${invoice?.invoiceNo ?? "N/A"}</h3>
          <p style="color: #4b5563; margin: 0 0 12px 0; font-size: 14px;">Transaction ID: ${invoice?.invoiceNo ?? "N/A"}</p>
          <div style="margin-bottom: 16px;">
            <span style="${getStatusBadge(invoice?.status)}">${(invoice?.status ?? "N/A").toString().toUpperCase()}</span>
          </div>
          <div style="text-align: right;">
            <p style="font-size: 13px; color: #6b7280; margin: 0 0 4px 0;">Invoice Date</p>
            <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0;">${invoiceDate}</p>
          </div>
        </div>

        <!-- Bill To & Transaction Details -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          <div style="background: #f9fafb; border-radius: 12px; padding: 20px;">
            <h4 style="font-size: 12px; font-weight: 600; color: #374151; margin: 0 0 12px 0; letter-spacing: 0.05em;">BILL TO</h4>
            <p style="font-weight: 500; color: #111827; font-size: 16px; margin: 0 0 6px 0;">${invoice?.customer ?? "N/A"}</p>
            <p style="color: #4b5563; font-size: 14px; margin: 0;">${invoice?.email ?? "N/A"}</p>
          </div>
          
          <div style="background: #f9fafb; border-radius: 12px; padding: 20px;">
            <h4 style="font-size: 12px; font-weight: 600; color: #374151; margin: 0 0 12px 0; letter-spacing: 0.05em;">TRANSACTION DETAILS</h4>
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #4b5563; font-size: 14px;">PayPal Order ID:</span>
              <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #111827;">99F23055TC169750B</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #4b5563; font-size: 14px;">Payment ID:</span>
              <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #111827;">Pending</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #4b5563; font-size: 14px;">Type:</span>
              <span style="color: #111827; font-size: 14px;">Subscription Purchase</span>
            </div>
          </div>
        </div>

        <!-- Plan Details -->
        <div style="background: #faf5ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h4 style="font-size: 12px; font-weight: 600; color: #374151; margin: 0 0 12px 0; letter-spacing: 0.05em;">PLAN DETAILS</h4>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 4px 0;">Basic (Monthly)</p>
              <p style="font-size: 13px; color: #4b5563; margin: 0;">Subscription Plan</p>
            </div>
            <div style="text-align: right;">
              <p style="font-size: 13px; color: #4b5563; margin: 0 0 4px 0;">Duration</p>
              <p style="font-weight: 500; color: #111827; margin: 0; font-size: 14px;">Monthly</p>
            </div>
          </div>
        </div>

        <!-- Financial Summary -->
        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <div style="background: #f3f4f6; padding: 12px 24px;">
            <h4 style="font-size: 12px; font-weight: 600; color: #374151; margin: 0; letter-spacing: 0.05em;">FINANCIAL SUMMARY</h4>
          </div>
          <div style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 12px;">
              <span style="color: #4b5563; font-size: 14px;">Subtotal:</span>
              <span style="font-weight: 500; color: #111827; font-size: 14px;">EUR ${Number(invoice?.amount ?? 119.00).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 12px;">
              <span style="color: #4b5563; font-size: 14px;">PayPal Fee:</span>
              <span style="font-weight: 500; color: #111827; font-size: 14px;">EUR ${Number(invoice?.paypalFee ?? 0.00).toFixed(2)}</span>
            </div>
            <div style="background: #dcfce7; padding: 12px 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #166534; font-weight: 600; font-size: 14px;">Net Amount:</span>
              <span style="color: #166534; font-weight: 700; font-size: 18px;">EUR ${Number(invoice?.netAmount ?? 119.00).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    `;

    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";

    document.body.appendChild(container);

    try {
      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `invoice-${invoice?.invoiceNo ?? "download"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();
    } finally {
      document.body.removeChild(container);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-[#111826] px-5 py-3 rounded-md mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-2xl font-bold">Invoices</h1>
        </div>
       
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 flex justify-end">
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <IoSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#f9fafb",
                headerColor: "#111826",
                headerBorderRadius: 8,
                rowHoverBg: "#f3f4f6",
                colorText: "#1f2937",
                colorLink: "#2563eb",
                colorLinkHover: "#1d4ed8",
                colorLinkActive: "#1e40af",
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
          {isError && <div className="text-red-500 text-center my-4">{error?.data?.message || "Failed to load transactions."}</div>}
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={isLoading}
            pagination={{ pageSize: 10 }}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            onRow={(record) => ({
              onClick: () => showViewModal(record),
            })}
          />
        </ConfigProvider>
      </div>

      {/* View Invoice Modal */}
      <Modal
        title="Invoice Details"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedInvoice && (
          <div className="py-6">
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">#{selectedInvoice.invoiceNo}</h3>
              <p className="text-gray-600 mt-1">Transaction ID: {selectedInvoice.invoiceNo}</p>
              <div className="mt-2">
                <span className={
                  selectedInvoice.status === 'completed' 
                    ? 'px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800' 
                    : selectedInvoice.status === 'pending'
                    ? 'px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
                    : 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800'
                }>
                  {selectedInvoice.status?.toUpperCase()}
                </span>
              </div>
              <div className="text-right mt-4">
                <p className="text-sm text-gray-500">Invoice Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {dayjs(selectedInvoice.date).format("DD MMMM YYYY")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">BILL TO</h4>
                <p className="font-medium text-gray-900 text-lg">{selectedInvoice.customer}</p>
                <p className="text-gray-600">{selectedInvoice.email}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">TRANSACTION DETAILS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">PayPal Order ID:</span>
                    <span className="font-mono text-sm">99F23055TC169750B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-sm">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">Subscription Purchase</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">PLAN DETAILS</h4>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Basic (Monthly)</p>
                  <p className="text-sm text-gray-600">Subscription Plan</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-900">Monthly</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-100 px-6 py-3">
                <h4 className="text-sm font-semibold text-gray-700">FINANCIAL SUMMARY</h4>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    EUR {selectedInvoice.amount?.toFixed(2) || '119.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">PayPal Fee:</span>
                  <span className="font-medium text-gray-900">
                    EUR {selectedInvoice.paypalFee?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                  <span className="text-green-800 font-semibold">Net Amount:</span>
                  <span className="text-green-800 font-bold text-lg">
                    EUR {selectedInvoice.netAmount?.toFixed(2) || '119.00'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => handleDownloadPdf(selectedInvoice)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FaFilePdf className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

export default Invoices;