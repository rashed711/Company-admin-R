
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../../../services/localization';
import Button from '../../ui/Button';

const PaymentVoucherEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();

    return (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Edit Payment Voucher #{id}</h1>
            <p className="text-gray-500 mb-6">(This is a placeholder page for editing payment vouchers)</p>
            <Button as={Link} to="/accounting/payment-vouchers" variant="primary">{t('back_to_list')}</Button>
        </div>
    );
};

export default PaymentVoucherEdit;
