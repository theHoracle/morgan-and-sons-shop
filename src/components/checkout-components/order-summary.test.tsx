import { render, screen, fireEvent } from '@testing-library/react';
import { OrderSummary } from './order-summary';
import { createPaymentSession } from '@/app/(frontend)/checkout/action';
import { toast } from 'sonner';

jest.mock('@/app/(frontend)/checkout/action');
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('OrderSummary', () => {
    const defaultProps = {
        cartId: '123',
        cartSubTotal: 5000,
        fullName: 'John Doe',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should redirect to payment provider on successful payment session creation', async () => {
        const mockResponse = {
            success: true,
            sessionUrl: 'http://payment-provider.com/session',
        };
        (createPaymentSession as jest.Mock).mockResolvedValue(mockResponse);

        render(<OrderSummary {...defaultProps} />);

        const confirmButton = screen.getByText('Confirm Order');
        fireEvent.click(confirmButton);

        expect(createPaymentSession).toHaveBeenCalledWith({
            cartId: defaultProps.cartId,
            unitAmount: 6000, // cartSubTotal + PROCESSING_FEE
            fullName: defaultProps.fullName,
        });

        await screen.findByText('Redirecting to payment provider...');
        expect(window.location.href).toBe(mockResponse.sessionUrl);
        expect(toast.success).toHaveBeenCalledWith('Redirecting to payment provider...');
    });

    it('should show error toast on failed payment session creation', async () => {
        const mockResponse = {
            success: false,
            error: 'Payment session creation failed',
        };
        (createPaymentSession as jest.Mock).mockResolvedValue(mockResponse);

        render(<OrderSummary {...defaultProps} />);

        const confirmButton = screen.getByText('Confirm Order');
        fireEvent.click(confirmButton);

        expect(createPaymentSession).toHaveBeenCalledWith({
            cartId: defaultProps.cartId,
            unitAmount: 6000, // cartSubTotal + PROCESSING_FEE
            fullName: defaultProps.fullName,
        });

        await screen.findByText('Payment session creation failed');
        expect(toast.error).toHaveBeenCalledWith(mockResponse.error);
    });
});