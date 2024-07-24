
export interface VendorInformation {
    vendorCode: string;
    gstin: string;
    siteId: string;
  }
  
  export interface Invoice {
    vendorName: string;
    invoiceNumber: string;
    invoiceStatus: string;
    dueDate: string;
    invoiceDifficulty: string;
    totalAmount: number;
    vendorInformation: VendorInformation;
    [key: string]: any; 
  }


  