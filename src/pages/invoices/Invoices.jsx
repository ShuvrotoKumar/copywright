import { ConfigProvider, Modal, Table, Form, DatePicker, Button } from "antd";
import { useState, useMemo } from "react";
import { IoSearch, IoChevronBack } from "react-icons/io5";
import { FaRegEye, FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetAllTransactionsQuery, useLazyGetPdfQuery, useLazyBulkDownloadQuery } from "../../redux/api/invoicesApi";
import dayjs from "dayjs";

function Invoices() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading, isError, error } = useGetAllTransactionsQuery({
    page: currentPage,
    limit: pageSize,
    ...(searchValue ? { invoiceNumber: searchValue } : {})
  });
  const [triggerGetPdf, { isFetching: isPdfDownloading }] = useLazyGetPdfQuery();
  const [triggerBulkDownload, { isFetching: isBulkDownloading }] = useLazyBulkDownloadQuery();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBulkDownloadModalOpen, setIsBulkDownloadModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const pagination = data?.data?.pagination;

  const invoices = useMemo(() => {
    if (!data?.data?.invoices) return [];
    return Array.isArray(data.data.invoices) ? data.data.invoices : [];
  }, [data]);

  const dataSource = useMemo(() => {
    return invoices.map(t => ({
      key: t._id,
      _id: t._id,
      invoiceNo: t.invoice_number,
      customer: t.buyer_name || 'N/A',
      email: t.user_id?.email || 'N/A',
      amount: t.gross_amount,
      date: t.invoice_date,
      status: 'completed',
      paypalOrderId: t.paypal_order_id,
      paypalPaymentId: t.paypal_payment_id,
      productName: t.product_name,
      netAmount: t.net_amount,
      vatAmount: t.vat_amount,
      grossAmount: t.gross_amount
    }));
  }, [invoices]);

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

  const handleDownloadPdf = async (invoice) => {
    if (isPdfDownloading) return;

    const invoiceId = invoice?._id;
    if (!invoiceId) return;

    try {
      const pdfBlob = await triggerGetPdf(invoiceId).unwrap();

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice?.invoiceNo || invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // intentionally silent for now
    }
  };

  const handleBulkDownload = async (values) => {
    if (!values.dateRange || values.dateRange.length !== 2) return;
    
    const startDate = values.dateRange[0].format('YYYY-MM-DD');
    const endDate = values.dateRange[1].format('YYYY-MM-DD');

    try {
      const zipBlob = await triggerBulkDownload({ startDate, endDate }).unwrap();
      
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoices_${startDate}_to_${endDate}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setIsBulkDownloadModalOpen(false);
      form.resetFields();
    } catch {
      // intentionally silent for now
    }
  };

  return (
    <div>
      <div className="bg-[#111826] px-4 md:px-5 py-3 rounded-md mb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:opacity-90 transition"
            aria-label="Go back"
          >
            <IoChevronBack className="w-6 h-6" />
          </button>
          <h1 className="text-white text-xl sm:text-2xl font-bold">Invoices</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="primary"
            onClick={() => setIsBulkDownloadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 h-10 px-4 rounded-md font-medium text-white border-none"
          >
            Bulk Download
          </Button>
          <div className="relative w-64 md:w-80">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white text-[#0D0D0D] placeholder-gray-500 pl-10 pr-3 py-2 rounded-md focus:outline-none"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              activeBorderColor: "#00c0b5",
            },
            Pagination: {
              colorPrimaryBorder: "#111827",
              colorBorder: "#111827",
              colorPrimaryHover: "#111827",
              colorTextPlaceholder: "#111827",
              itemActiveBgDisabled: "#111827",
              colorPrimary: "#111827",
            },
            Table: {
              headerBg: "#f9fafb",
              headerColor: "#000000",
              cellFontSize: 16,
              headerSplitColor: "#f9fafb",
              colorTextHeading: "#000000",
            },
          },
        }}
      >
          {isError && <div className="text-red-500 text-center my-4">{error?.data?.message || "Failed to load invoices."}</div>}
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={isLoading}
            pagination={{
              current: pagination?.page ?? currentPage,
              pageSize: pagination?.limit ?? pageSize,
              total: pagination?.total ?? 0,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              onChange: (page, nextPageSize) => {
                if (typeof nextPageSize === "number" && nextPageSize !== pageSize) {
                  setPageSize(nextPageSize);
                  setCurrentPage(1);
                  return;
                }
                setCurrentPage(page);
              },
            }}
            rowClassName="hover:bg-gray-50 cursor-pointer"
            onRow={(record) => ({
              onClick: () => showViewModal(record),
            })}
          />
        </ConfigProvider>

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
                    <span className="font-mono text-sm">{selectedInvoice.paypalOrderId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-sm">{selectedInvoice.paypalPaymentId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="text-gray-900">Subscription Purchase</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-5 mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">PRODUCT DETAILS</h4>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selectedInvoice.productName}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden mb-6">
              <div className="bg-gray-100 px-6 py-3">
                <h4 className="text-sm font-semibold text-gray-700">FINANCIAL SUMMARY</h4>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Net Amount:</span>
                  <span className="font-medium text-gray-900">
                    EUR {selectedInvoice.netAmount?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">VAT Amount:</span>
                  <span className="font-medium text-gray-900">
                    EUR {selectedInvoice.vatAmount?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                  <span className="text-green-800 font-semibold">Gross Amount:</span>
                  <span className="text-green-800 font-bold text-lg">
                    EUR {selectedInvoice.grossAmount?.toFixed(2) || '0.00'}
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

      {/* Bulk Download Modal */}
      <Modal
        title="Bulk Download Invoices"
        open={isBulkDownloadModalOpen}
        onCancel={() => setIsBulkDownloadModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleBulkDownload}
        >
          <Form.Item
            name="dateRange"
            label="Select Date Range"
            rules={[{ required: true, message: 'Please select a date range' }]}
          >
            <DatePicker.RangePicker className="w-full" />
          </Form.Item>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsBulkDownloadModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBulkDownloading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isBulkDownloading ? 'Downloading...' : 'Download ZIP'}
            </button>
          </div>
        </Form>
      </Modal>

    </div>
  );
}

export default Invoices;
