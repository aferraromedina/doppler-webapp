import React from 'react';
import PropTypes from 'prop-types';
import { SUBSCRIPTION_TYPE } from '../../../../doppler-types';
import { useIntl } from 'react-intl';

export const Discounts = ({ discounts, selectedDiscount, onSelectDiscount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const getDiscountName = (subscriptionType) => {
    switch (subscriptionType) {
      case SUBSCRIPTION_TYPE.monthly:
      case SUBSCRIPTION_TYPE.quarterly:
      case SUBSCRIPTION_TYPE.biyearly:
      case SUBSCRIPTION_TYPE.yearly:
        return _('plan_calculator.discount_' + subscriptionType.replace('-', '_'));
      default:
        return '';
    }
  };

  return (
    <>
      <div className="dp-wrap-subscription">
        <h4>{_('plan_calculator.discount_title')}</h4>
        <ul aria-label="discounts">
          {discounts.map((discount) => (
            <li key={discount.id}>
              <button
                className={`dp-button button-medium ${
                  discount.id === selectedDiscount?.id ? 'btn-active' : ''
                }`}
                onClick={() => onSelectDiscount(discount)}
              >
                {getDiscountName(discount.subscriptionType)}
              </button>
              {discount.discountPercentage > 0 && (
                <span className="dp-discount">{`${discount.discountPercentage}% OFF`}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

Discounts.propTypes = {
  discounts: PropTypes.array.isRequired,
  selectedDiscount: PropTypes.object,
  onSelectDiscount: PropTypes.func.isRequired,
};
