import { Donation } from '@/domain/Donation';
import ExcelJS from 'exceljs';

export async function exportDonationsToExcel(donations: Donation[]) {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Donaciones');

  // Define columns
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 25 },
    { header: 'Referencia', key: 'reference', width: 15 },
    { header: 'Nombres', key: 'firstName', width: 20 },
    { header: 'Apellidos', key: 'lastName', width: 20 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Tipo ID', key: 'idType', width: 10 },
    { header: 'Número ID', key: 'idNumber', width: 15 },
    { header: 'País', key: 'country', width: 15 },
    { header: 'Ciudad', key: 'city', width: 15 },
    { header: 'Dirección', key: 'address', width: 30 },
    { header: 'Celular', key: 'mobile', width: 15 },
    { header: 'Afiliación', key: 'affiliation', width: 20 },
    { header: 'Monto', key: 'amount', width: 15 },
    { header: 'Destino', key: 'destination', width: 25 },
    { header: 'Estado', key: 'status', width: 15 },
    { header: 'Requiere Certificado', key: 'donationSupport', width: 20 },
    { header: 'Términos y Condiciones', key: 'termsAndConditions', width: 20 },
    { header: 'Ticket ID', key: 'ticketId', width: 20 },
    { header: 'URL de Pago', key: 'paymentUrl', width: 40 },
    { header: 'Comentarios', key: 'comments', width: 30 },
    { header: 'Mensaje de Error', key: 'errorMessage', width: 30 },
    { header: 'Fecha Creación', key: 'createdAt', width: 20 },
    { header: 'Fecha Actualización', key: 'updatedAt', width: 20 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // Add data rows
  donations.forEach((donation) => {
    worksheet.addRow({
      id: donation.id,
      reference: donation.reference,
      firstName: donation.firstName,
      lastName: donation.lastName,
      email: donation.email,
      idType: donation.idType,
      idNumber: donation.idNumber,
      country: donation.country,
      city: donation.city,
      address: donation.address,
      mobile: donation.mobile,
      affiliation: donation.affiliation,
      amount: donation.amount,
      destination: donation.destination,
      status: donation.status,
      donationSupport: donation.donationSupport ? 'Sí' : 'No',
      termsAndConditions: donation.termsAndConditions ? 'Sí' : 'No',
      ticketId: donation.ticketId || '',
      paymentUrl: donation.paymentUrl || '',
      comments: donation.comments || '',
      errorMessage: donation.errorMessage || '',
      createdAt: new Date(donation.createdAt).toLocaleString('es-CO'),
      updatedAt: new Date(donation.updatedAt).toLocaleString('es-CO'),
    });
  });

  // Generate Excel file as buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Create blob and download
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `donaciones_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();

  // Clean up
  window.URL.revokeObjectURL(url);
}
