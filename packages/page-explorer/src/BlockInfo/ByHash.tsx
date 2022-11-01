// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderExtended } from '@polkadot/api-derive/types';
import type { KeyedEvent } from '@polkadot/react-query/types';
import type { EventRecord, SignedBlock } from '@polkadot/types/interfaces';

import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AddressSmall, Columar, LinkExternal, Table } from '@polkadot/react-components';
import { useApi, useIsMountedRef } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import Events from '../Events';
import { useTranslation } from '../translate';
import Extrinsics from './Extrinsics';
import Justifications from './Justifications';
import Logs from './Logs';
import Summary from './Summary';

interface Props {
  className?: string;
  error?: Error | null;
  value?: string | null;
}

const EMPTY_HEADER = [['...', 'start', 6]];

function transformResult ([events, getBlock, getHeader]: [EventRecord[], SignedBlock, HeaderExtended?]): [KeyedEvent[], SignedBlock, HeaderExtended?] {
  return [
    events.map((record, index) => ({
      indexes: [index],
      key: `${Date.now()}-${index}-${record.hash.toHex()}`,
      record
    })),
    getBlock,
    getHeader
  ];
}

function BlockByHash ({ className = '', error, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [[events, getBlock, getHeader], setState] = useState<[KeyedEvent[]?, SignedBlock?, HeaderExtended?]>([]);
  const [confidence, setConfidence] = useState<string>('0 %');
  const [myError, setError] = useState<Error | null | undefined>(error);

  useEffect((): void => {
    value && Promise
      .all([
        api.query.system.events.at(value),
        api.rpc.chain.getBlock(value),
        api.derive.chain.getHeader(value)
      ])
      .then((result): void => {
        mountedRef.current && setState(transformResult(result));

        const number = result[2]?.number.unwrap().toNumber();
        // let LightClientURI = 'https://testnet.polygonavail.net/light/v1';
        let LightClientURI = process.env.LIGHTCLIENT as string + '/v1';

        const url = new URL(window.location.href);
        const searchParams = new URLSearchParams(url.search);
        const getParam = searchParams.get('light');
        const savedLcUri = window.localStorage.getItem('lcUrl');

        if (getParam) {
          LightClientURI = getParam;
        } else if (savedLcUri !== null) {
          LightClientURI = savedLcUri;
        }

        console.log('Using Light Client at ', LightClientURI);

        axios.get(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `confidence/${number}`,
          {
            baseURL: LightClientURI,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then((v) => {
          console.log(v);

          if (v.status !== 200) {
            setConfidence('ℹ️ Make sure Light Client runs on ' + LightClientURI);

            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          setConfidence(v.data.confidence);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }).catch((_) => {
          setConfidence('ℹ️ Make sure Light Client runs on ' + LightClientURI);
          console.log('Light client: Called, but failed');
        });
      })
      .catch((error: Error): void => {
        mountedRef.current && setError(error);
      });
  }, [api, mountedRef, value]);

  const header = useMemo(
    () => getHeader
      ? [
        [formatNumber(getHeader.number.unwrap()), 'start', 1],
        [t('hash'), 'start'],
        [t('parent'), 'start'],
        [t('extrinsics'), 'start'],
        [t('state'), 'start'],
        [t('confidence'), 'start'],
        [undefined, 'media--1200']
      ]
      : EMPTY_HEADER,
    [getHeader, t]
  );

  const blockNumber = getHeader?.number.unwrap();
  const parentHash = getHeader?.parentHash.toHex();
  const hasParent = !getHeader?.parentHash.isEmpty;

  return (
    <div className={className}>
      <Summary
        events={events}
        maxBlockWeight={api.consts.system.blockWeights?.maxBlock}
        signedBlock={getBlock}
      />
      <Table
        header={header}
        isFixed
      >
        {myError
          ? <tr><td colSpan={6}>{t('Unable to retrieve the specified block details. {{error}}', { replace: { error: myError.message } })}</td></tr>
          : getBlock && getHeader && !getBlock.isEmpty && !getHeader.isEmpty && (
            <tr>
              <td className='address'>
                {getHeader.author && (
                  <AddressSmall value={getHeader.author} />
                )}
              </td>
              <td className='hash overflow'>{getHeader.hash.toHex()}</td>
              <td className='hash overflow'>{
                hasParent
                  ? <Link to={`/explorer/query/${parentHash || ''}`}>{parentHash}</Link>
                  : parentHash
              }</td>
              <td className='hash overflow'>{getHeader.extrinsicsRoot.toHex()}</td>
              <td className='hash overflow'>{getHeader.stateRoot.toHex()}</td>
              <td className='hash overflow'>{confidence}</td>
              <td className='media--1200'>
                <LinkExternal
                  data={value}
                  type='block'
                />
              </td>
            </tr>
          )
        }
      </Table>
      {getBlock && getHeader && (
        <>
          <Extrinsics
            blockNumber={blockNumber}
            events={events}
            value={getBlock.block.extrinsics}
          />
          <Columar>
            <Columar.Column>
              <Events
                eventClassName='explorer--BlockByHash-block'
                events={events?.filter(({ record: { phase } }) => !phase.isApplyExtrinsic)}
                label={t<string>('system events')}
              />
            </Columar.Column>
            <Columar.Column>
              <Logs value={getHeader.digest.logs} />
              <Justifications value={getBlock.justifications} />
            </Columar.Column>
          </Columar>
        </>
      )}
    </div>
  );
}

export default React.memo(BlockByHash);
