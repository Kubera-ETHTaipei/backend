//@ts-ignore
import { BigInt, require } from "@ora-io/cle-lib";
import { Bytes, Block, Event, console } from "@ora-io/cle-lib";

let addr = Bytes.fromHexString("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
let esig_deposit = Bytes.fromHexString(
  "0xde6857219544bb5b7746f48ed30be6386fefc61b2f864cacf559893bf50fd951"
);
let esig_withdraw = Bytes.fromHexString(
  "0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b"
);

export function handleBlocks(blocks: Block[]): Bytes {
  // init output state
  let state: Bytes = Bytes.empty();
  let deposit_signal = Bytes.fromI32(0);
  let withdraw_signal = Bytes.fromI32(1);

  let events = blocks[0].accountByBytes(addr).eventsByEsig(esig_withdraw);
  // console.log(events.length.toString());

  // if (events[0].esig == esig_deposit) {
  //   // if (blocks[0].account(addr).eventsByEsig(esig_deposit).length > 0) {
  //   let event_data = events[0].data.slice(32);

  //   state = Bytes.fromByteArray(deposit_signal.concat(event_data));
  // } else if (events[0].esig == esig_withdraw) {
  //   let event_data = events[0].data;

  //   state = Bytes.fromByteArray(withdraw_signal.concat(event_data));
  // }
  if (events.length > 0) {
    let reserve = events[0].topic1;
    let data = events[0].data.slice(0, 64);

    state = Bytes.fromByteArray(reserve.concat(data));
  }

  return state;
}

//00000001000000000000000000000000000000000000000000000000000000000ba4fa85
//000000000000000000000000000000000000000000000000000000000ba4fa85
