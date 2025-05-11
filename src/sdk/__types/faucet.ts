export type Faucet = {
  "version": "0.1.0",
  "name": "faucet",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "faucetAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "faucetAccountBump",
          "type": "u8"
        },
        {
          "name": "faucetAmount",
          "type": "u64"
        },
        {
          "name": "faucetPeriod",
          "type": "i64"
        }
      ]
    },
    {
      "name": "faucet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "faucetAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faucetHistory",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "faucetAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "faucetAccountBump",
            "type": "u8"
          },
          {
            "name": "faucetAmount",
            "type": "u64"
          },
          {
            "name": "faucetPeriod",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "faucetHistory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastRequest",
            "type": "i64"
          },
          {
            "name": "totalRequest",
            "type": "u128"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "IncorrectOwner",
      "msg": "Account has incorrect owner!"
    },
    {
      "code": 6001,
      "name": "IncorrectTokenOwner",
      "msg": "Account has incorrect token owner!"
    },
    {
      "code": 6002,
      "name": "TooMuchRequest",
      "msg": "Too much request!"
    },
    {
      "code": 6003,
      "name": "PermissionDenied",
      "msg": "Permission denied"
    }
  ]
};

export const IDL: Faucet = {
  "version": "0.1.0",
  "name": "faucet",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "faucetAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authorityTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "faucetAccountBump",
          "type": "u8"
        },
        {
          "name": "faucetAmount",
          "type": "u64"
        },
        {
          "name": "faucetPeriod",
          "type": "i64"
        }
      ]
    },
    {
      "name": "faucet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "faucetAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "faucetHistory",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "faucetAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "faucetAccountBump",
            "type": "u8"
          },
          {
            "name": "faucetAmount",
            "type": "u64"
          },
          {
            "name": "faucetPeriod",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "faucetHistory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastRequest",
            "type": "i64"
          },
          {
            "name": "totalRequest",
            "type": "u128"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "IncorrectOwner",
      "msg": "Account has incorrect owner!"
    },
    {
      "code": 6001,
      "name": "IncorrectTokenOwner",
      "msg": "Account has incorrect token owner!"
    },
    {
      "code": 6002,
      "name": "TooMuchRequest",
      "msg": "Too much request!"
    },
    {
      "code": 6003,
      "name": "PermissionDenied",
      "msg": "Permission denied"
    }
  ]
};
