import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import useTimeout from '../../hooks/useTimeout';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { InjectAppServices } from '../../services/pure-di';
import { FirstSteps } from './FirstSteps';
import { Kpi } from './Kpis/Kpi';
import { DashboardIconLink, DashboardIconSubTitle, KpiGroup } from './Kpis/KpiGroup';
import { LearnWithDoppler } from './LearnWithDoppler';

export const kpiListFake = {
  Campaings: [
    {
      kpiTitle: `Total de Envios`,
      kpiValue: `21458`,
      iconClass: `deliveries`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `Tasa de Apertura`,
      kpiValue: `57%`,
      iconClass: `open-rate`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `CTR`,
      kpiValue: `215%`,
      iconClass: `ctr`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
  ],
  Subscribers: [
    {
      kpiTitle: `Total de Contactos`,
      kpiValue: `21458`,
      iconClass: `book`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `Contactos Nuevos`,
      kpiValue: `943`,
      iconClass: `user-new`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `Contactos removidos`,
      kpiValue: `94`,
      iconClass: `user-removed`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
  ],
};

export const Dashboard = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const [kpiList, setKpiList] = useState({});
  const [loading, setLoading] = useState(true);
  const userName = appSessionRef?.current.userData.user.fullname.split(' ')[0]; // Get firstname
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const createTimeout = useTimeout();

  useEffect(() => {
    const campaings = kpiListFake.Campaings;
    const subscribers = kpiListFake.Subscribers;

    setKpiList({
      campaings,
      subscribers,
    });

    createTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [createTimeout]);

  const renderKpis = (listType) => {
    return kpiList[listType]?.map((kpi, index) => (
      <Kpi key={`kpi-campaing-${index}`} {...kpi} colSize={kpiListSize[listType]}></Kpi>
    ));
  };

  const kpiListSize = {
    campaings: 12 / (!kpiListFake.Campaings?.length ? 1 : kpiListFake.Campaings.length),
    subscribers: 12 / (!kpiListFake.Subscribers?.length ? 1 : kpiListFake.Subscribers.length),
  };

  return (
    <div className="dp-dashboard p-b-48">
      <header className="hero-banner">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h2>
                ¡{_('dashboard.welcome_message')} {userName}!
              </h2>
            </div>
            <div className="col-sm-12">
              <FormattedMessageMarkdown id="dashboard.welcome_message_header" />
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-8 col-md-12 m-b-24">
            <div className="dp-dashboard-title">
              <DashboardIconSubTitle title="dashboard.campaigns" iconClass="deliveries" />
              <DashboardIconLink linkTitle="dashboard.sent_deliveries" link="#" />
            </div>
            <KpiGroup loading={loading}>{renderKpis('campaings')}</KpiGroup>
            <div className="dp-dashboard-title">
              <DashboardIconSubTitle title="dashboard.contacts" iconClass="subscribers" />
              <DashboardIconLink linkTitle="dashboard.sent_deliveries" link="#" />
            </div>
            <KpiGroup loading={loading} disabled={true}>
              {renderKpis('subscribers')}
            </KpiGroup>
            <div className="dp-dashboard-title">
              <DashboardIconSubTitle
                title="dashboard.learn_with_doppler"
                iconClass="dp-learn-with-doppler"
              />
            </div>
            <LearnWithDoppler />
          </div>
          <div className="col-lg-4 col-sm-12">
            <FirstSteps />
          </div>
        </div>
      </div>
    </div>
  );
});
