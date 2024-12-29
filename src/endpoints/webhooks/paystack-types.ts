// Type for Metadata object
type Metadata = {
    userId: string;
    orderId: string;
  };
  
  // Type for Authorization object
  type Authorization = {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
    receiver_bank_account_number: string | null;
    receiver_bank: string | null;
  };
  
  // Type for Customer object
  type Customer = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: any; // Adjust the type for metadata as needed
    risk_action: string;
    international_format_phone: string | null;
  };
  
  // Type for Plan object (empty in this case, could be extended)
  type Plan = object;
  
  // Type for Subaccount object (empty in this case, could be extended)
  type Subaccount = object;
  
  // Type for the Event Data
  type PaystackWebhookData = {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Metadata;
    fees_breakdown: any | null; // Can define a more specific type if you know the structure
    log: any | null; // Adjust as necessary
    fees: number;
    fees_split: any | null; // Adjust as necessary
    authorization: Authorization;
    customer: Customer;
    plan: Plan;
    subaccount: Subaccount;
  };
  
  // Type for the Paystack Webhook Event
  export type PaystackWebhookEvent = {
    event: string;
    data: PaystackWebhookData;
  };