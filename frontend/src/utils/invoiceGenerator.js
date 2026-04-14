import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
  try {
    if (!order) {
      alert("No order data available for invoice.");
      return;
    }

    const doc = new jsPDF();
  
  // Header
  // Using default fonts, wait for custom if needed
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("TAX INVOICE", 14, 22);
  
  // Brand / Logistics
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("E-Store Luxury Commerce", 14, 30);
  doc.text("Logistics & Order Processing", 14, 35);
  
  // Order Info
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Order ID: ${order._id}`, 110, 30);
  doc.text(`Date Ordered: ${new Date(order.createdAt).toLocaleDateString()}`, 110, 36);
  doc.text(`Payment: ${order.isPaid ? 'Paid' : 'Pending/COD'}`, 110, 42);
  
  // Customer Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Billed To:", 14, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${order.user?.username || order.user?.name || "Guest Check-out"}`, 14, 56);
  doc.text(`Email: ${order.user?.email || "N/A"}`, 14, 62);
  
  const address = order.shippingAddress;
  if (address) {
    doc.text(`Address: ${address.address}`, 14, 68);
    doc.text(`${address.city}, ${address.postalCode}, ${address.country}`, 14, 74);
  }
  
  let yPos = 85;
  
  // Table
  const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
  const tableRows = [];
  
  if (order.orderItems && order.orderItems.length > 0) {
    order.orderItems.forEach((item) => {
      const rowData = [
        item.name || "Item",
        item.qty?.toString() || "1",
        `Rs ${(item.price || 0).toLocaleString("en-IN")}`,
        `Rs ${((item.qty || 1) * (item.price || 0)).toLocaleString("en-IN")}`
      ];
      tableRows.push(rowData);
    });
  }
  
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: yPos,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }, // emerald-500
    styles: { fontSize: 10, cellPadding: 4 }
  });
  
  const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 15 : yPos + 40;
  
  // Summary Box
  doc.setFontSize(10);
  doc.text(`Items Subtotal:`, 130, finalY);
  doc.text(`Rs ${(order.itemsPrice || 0).toLocaleString("en-IN")}`, 170, finalY);
  
  doc.text(`Shipping Charges:`, 130, finalY + 7);
  doc.text(`Rs ${(order.shippingPrice || 0).toLocaleString("en-IN")}`, 170, finalY + 7);
  
  doc.text(`Estimated Tax:`, 130, finalY + 14);
  doc.text(`Rs ${(order.taxPrice || 0).toLocaleString("en-IN")}`, 170, finalY + 14);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Net Total:`, 130, finalY + 24);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`Rs ${(order.totalPrice || 0).toLocaleString("en-IN")}`, 170, finalY + 24);
  
  // Footer message
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for choosing E-Store.", 14, finalY + 40);
  
  // Open PDF in a new tab for preview instead of forcing download
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
  
  } catch (error) {
    console.error("PDF Generation Error:", error);
    alert("Failed to generate PDF. Check console for details: " + error.message);
  }
};
