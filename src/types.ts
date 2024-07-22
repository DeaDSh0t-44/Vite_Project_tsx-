
export interface VendorInformation {
    vendorCode: string;
    vendorName: string;
    gstin: string;
    siteId: string;
  }
  
  export interface Invoice {
    invoiceNumber: string;
    invoiceStatus: string;
    dueDate: string;
    invoiceDifficulty: string;
    totalAmount: number;
    vendorInformation: VendorInformation;
    [key: string]: any; // For additional properties
  }
  