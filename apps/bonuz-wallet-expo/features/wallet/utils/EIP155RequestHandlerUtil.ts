import { formatJsonRpcError, formatJsonRpcResult } from '@walletconnect/jsonrpc-utils';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';

import { EIP155_CHAINS, EIP155_SIGNING_METHODS, TEIP155Chain } from '../data/EIP155';
import { eip155Wallets } from '../utils/EIP155WalletUtil';
import {
  getSignParamsMessage,
  getSignTypedDataParamsData,
  getWalletAddressFromParams,
} from './HelperUtils';
import { currentETHAddress } from './WalletConnectUtil';

type RequestEventArgs = Omit<SignClientTypes.EventArguments['session_request'], 'verifyContext'>;
export async function approveEIP155Request(requestEvent: RequestEventArgs) {
  const { params, id } = requestEvent;
  const { chainId, request } = params;
  const wallet = eip155Wallets[getWalletAddressFromParams([currentETHAddress], params)];

  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN: {
      try {
        const message = getSignParamsMessage(request.params);
        const signedMessage = await wallet.signMessage(
          message,
          EIP155_CHAINS[chainId as TEIP155Chain].chainId,
        );
        return formatJsonRpcResult(id, signedMessage);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }
    }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4: {
      try {
        const { domain, types, message: data } = getSignTypedDataParamsData(request.params);
        // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
        delete types.EIP712Domain;
        const signedData = await wallet._signTypedData(
          domain,
          types,
          data,
          EIP155_CHAINS[chainId as TEIP155Chain].chainId,
        );
        return formatJsonRpcResult(id, signedData);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }
    }

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION: {
      try {
        const sendTransaction = request.params[0];
        const hash = await wallet.sendTransaction(
          sendTransaction,
          EIP155_CHAINS[chainId as TEIP155Chain].chainId,
        );
        return formatJsonRpcResult(id, hash);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }
    }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION: {
      try {
        const signTransaction = request.params[0];
        const signature = await wallet.signTransaction(
          signTransaction,
          EIP155_CHAINS[chainId as TEIP155Chain].chainId,
        );
        return formatJsonRpcResult(id, signature);
      } catch (error: any) {
        console.error(error);
        console.log(error.message);
        return formatJsonRpcError(id, error.message);
      }
    }

    default: {
      throw new Error(getSdkError('INVALID_METHOD').message);
    }
  }
}

export function rejectEIP155Request(request: RequestEventArgs) {
  const { id } = request;

  return formatJsonRpcError(id, getSdkError('USER_REJECTED').message);
}
