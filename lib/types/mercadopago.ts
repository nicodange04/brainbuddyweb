// Tipos para integración con Mercado Pago

export interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export interface MercadoPagoItem {
  title: string
  description: string
  quantity: number
  unit_price: number
  currency_id: 'ARS' | 'USD' | 'BRL' | 'MXN' | 'CLP' | 'COP' | 'PEN' | 'UYU'
}

export interface MercadoPagoPayer {
  name?: string
  surname?: string
  email: string
  phone?: {
    area_code?: string
    number?: string
  }
  identification?: {
    type: string
    number: string
  }
  address?: {
    zip_code?: string
    street_name?: string
    street_number?: number
  }
}

export interface CreatePreferenceRequest {
  items: MercadoPagoItem[]
  payer?: MercadoPagoPayer
  back_urls?: {
    success?: string
    failure?: string
    pending?: string
  }
  auto_return?: 'approved' | 'all'
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>
    excluded_payment_types?: Array<{ id: string }>
    installments?: number
  }
  notification_url?: string
  statement_descriptor?: string
  external_reference?: string
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

export interface MercadoPagoPayment {
  id: number
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back'
  status_detail: string
  transaction_amount: number
  currency_id: string
  date_created: string
  date_approved?: string
  payment_method_id: string
  payment_type_id: string
  payer: {
    id?: string
    email: string
    identification?: {
      type: string
      number: string
    }
  }
  external_reference?: string
  metadata?: Record<string, unknown>
}

export interface MercadoPagoWebhook {
  id: number
  live_mode: boolean
  type: string
  date_created: string
  application_id: number
  user_id: number
  version: number
  api_version: string
  action: string
  data: {
    id: string
  }
}

export interface SubscriptionPaymentData {
  planId: string
  planName: string
  userId: string
  userEmail: string
  amount: number
  currency: 'ARS' | 'USD' | 'BRL' | 'MXN' | 'CLP' | 'COP' | 'PEN' | 'UYU'
  frequency: 'monthly' | 'annual'
  trialDays?: number
}

