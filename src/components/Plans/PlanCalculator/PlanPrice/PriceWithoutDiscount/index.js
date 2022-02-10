import React from 'react';
import { useIntl } from 'react-intl';
import { getPlanFee, thousandSeparatorNumber } from '../../../../../utils';
import PropTypes from 'prop-types';

export const PriceWithoutDiscount = ({ selectedPlan }) => {
  const intl = useIntl();

  const formatedFee = thousandSeparatorNumber(intl.defaultLocale, getPlanFee(selectedPlan));
  return (
    <>
      <span className="dp-price-old">
        <span className="dp-price-old-money">US$</span>
        <span className="dp-price-old-amount">{formatedFee}</span>
      </span>
    </>
  );
};

PriceWithoutDiscount.propTypes = {
  selectedPlan: PropTypes.object,
};
