//import {Idl, IdlAccountDef} from "@project-serum/anchor/src/idl";
//import {IdlTypes, TypeDef} from "@project-serum/anchor/src/program/namespace/types";


import {Idl, IdlTypes} from "@project-serum/anchor";
import {IdlAccountDef} from "@project-serum/anchor/dist/esm/idl";
import {TypeDef} from "@project-serum/anchor/dist/esm/program/namespace/types";

export type NullableIdlAccount<IDL extends Idl> = IDL["accounts"] extends undefined
  ? IdlAccountDef
  : NonNullable<IDL["accounts"]>[number];

export type AccountTypeDef<IDL extends Idl> = TypeDef<NullableIdlAccount<IDL>, IdlTypes<IDL>>
//export type AccountClient<T>
