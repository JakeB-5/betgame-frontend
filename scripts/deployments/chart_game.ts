export type ChartGame = {
  "version": "0.1.0",
  "name": "chart_game",
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
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "managerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "changeAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "changeManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newManager",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "initGame",
      "accounts": [
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "afterGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topPlayersAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recentlyGamesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
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
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "afterStartTime",
          "type": "i64"
        },
        {
          "name": "afterEndTime",
          "type": "i64"
        },
        {
          "name": "timeCorrection",
          "type": "i64"
        }
      ]
    },
    {
      "name": "betGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "betData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "betDirection",
          "type": {
            "defined": "BetDirection"
          }
        },
        {
          "name": "betAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "beforeGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "afterGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recentlyGamesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
      "args": [
        {
          "name": "beforeStartTime",
          "type": "i64"
        },
        {
          "name": "beforeEndTime",
          "type": "i64"
        },
        {
          "name": "beforeOpenPrice",
          "type": "u64"
        },
        {
          "name": "beforeClosePrice",
          "type": "u64"
        },
        {
          "name": "currentStartTime",
          "type": "i64"
        },
        {
          "name": "currentEndTime",
          "type": "i64"
        },
        {
          "name": "afterStartTime",
          "type": "i64"
        },
        {
          "name": "afterEndTime",
          "type": "i64"
        },
        {
          "name": "timeCorrection",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topPlayersAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "modifyGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "newStartTime",
          "type": "i64"
        },
        {
          "name": "newEndTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "closeGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfigData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "managerAccount",
            "type": "publicKey"
          },
          {
            "name": "gameCount",
            "type": "u128"
          },
          {
            "name": "gameState",
            "type": {
              "option": {
                "defined": "GameState"
              }
            }
          },
          {
            "name": "beforeStartTime",
            "type": "i64"
          },
          {
            "name": "beforeEndTime",
            "type": "i64"
          },
          {
            "name": "currentStartTime",
            "type": "i64"
          },
          {
            "name": "currentEndTime",
            "type": "i64"
          },
          {
            "name": "afterStartTime",
            "type": "i64"
          },
          {
            "name": "afterEndTime",
            "type": "i64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "blockTime",
            "type": "i64"
          },
          {
            "name": "timePerSlot",
            "type": "i64"
          },
          {
            "name": "timeCorrection",
            "type": "i64"
          },
          {
            "name": "timeCorrectionPerSlot",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "gameData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "betPeriod",
            "type": "i64"
          },
          {
            "name": "openPrice",
            "type": "u64"
          },
          {
            "name": "closePrice",
            "type": "u64"
          },
          {
            "name": "longBetAmount",
            "type": "u64"
          },
          {
            "name": "longBetCount",
            "type": "u32"
          },
          {
            "name": "shortBetAmount",
            "type": "u64"
          },
          {
            "name": "shortBetCount",
            "type": "u32"
          },
          {
            "name": "claimPrizeCount",
            "type": "u64"
          },
          {
            "name": "maxLongBetAmount",
            "type": "u64"
          },
          {
            "name": "maxShortBetAmount",
            "type": "u64"
          },
          {
            "name": "finish",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "betData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "betDirection",
            "type": {
              "option": {
                "defined": "BetDirection"
              }
            }
          },
          {
            "name": "betAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "countWin",
            "type": "u32"
          },
          {
            "name": "countLose",
            "type": "u32"
          },
          {
            "name": "countDraw",
            "type": "u32"
          },
          {
            "name": "countBet",
            "type": "u32"
          },
          {
            "name": "countGame",
            "type": "u32"
          },
          {
            "name": "totalBet",
            "type": "u128"
          },
          {
            "name": "totalLongBet",
            "type": "u128"
          },
          {
            "name": "totalShortBet",
            "type": "u128"
          },
          {
            "name": "totalClaim",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "userEntrantData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "front",
            "type": "u32"
          },
          {
            "name": "rear",
            "type": "u32"
          },
          {
            "name": "entrantsQueue",
            "type": {
              "array": [
                "publicKey",
                6
              ]
            }
          }
        ]
      }
    },
    {
      "name": "topPlayers",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "array": [
                {
                  "defined": "TopPlayer"
                },
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "recentlyGames",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "front",
            "type": "u32"
          },
          {
            "name": "rear",
            "type": "u32"
          },
          {
            "name": "queue",
            "type": {
              "array": [
                {
                  "defined": "GameSummary"
                },
                16
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TopPlayer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "account",
            "type": "publicKey"
          },
          {
            "name": "prize",
            "type": "u128"
          },
          {
            "name": "countWin",
            "type": "u32"
          },
          {
            "name": "countLose",
            "type": "u32"
          },
          {
            "name": "countDraw",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "GameSummary",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "longBetAmount",
            "type": "u64"
          },
          {
            "name": "longBetCount",
            "type": "u32"
          },
          {
            "name": "shortBetAmount",
            "type": "u64"
          },
          {
            "name": "shortBetCount",
            "type": "u32"
          },
          {
            "name": "changed",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "OnGoing"
          },
          {
            "name": "Pausing"
          }
        ]
      }
    },
    {
      "name": "BetDirection",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "LONG"
          },
          {
            "name": "SHORT"
          }
        ]
      }
    },
    {
      "name": "GameResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "LONG"
          },
          {
            "name": "SHORT"
          },
          {
            "name": "DRAW"
          },
          {
            "name": "CANCEL"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "GameChanged",
      "fields": [
        {
          "name": "beforeStartTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "beforeEndTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "currentStartTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "currentEndTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "afterStartTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "afterEndTime",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "GameUpdated",
      "fields": [
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "betPeriod",
          "type": "i64",
          "index": false
        },
        {
          "name": "openPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "closePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "longBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "longBetCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "shortBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "shortBetCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "maxLongBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "maxShortBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finish",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "UserBet",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "betDirection",
          "type": {
            "option": {
              "defined": "BetDirection"
            }
          },
          "index": false
        },
        {
          "name": "betAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UserClaim",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "betAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "divideRate",
          "type": "u64",
          "index": false
        }
      ]
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
      "name": "IncorrectManager",
      "msg": "Account has incorrect manager!"
    },
    {
      "code": 6003,
      "name": "InvalidBetDirection",
      "msg": "BetDirection must be one-way"
    },
    {
      "code": 6004,
      "name": "InvalidBetAmount",
      "msg": "Amount must be positive"
    },
    {
      "code": 6005,
      "name": "EntrantsQueueIsFull",
      "msg": "Entrants queue is full. Claim prize first"
    },
    {
      "code": 6006,
      "name": "EntrantsQueueIsEmpty",
      "msg": "Entrants queue is empty"
    },
    {
      "code": 6007,
      "name": "IncorrectAccountsLength",
      "msg": "Incorrect length of accounts"
    },
    {
      "code": 6008,
      "name": "IncorrectClaimAccount",
      "msg": "Account for claim is incorrect"
    },
    {
      "code": 6009,
      "name": "IncorrectClaimAccounts",
      "msg": "Accounts for claim is incorrect"
    },
    {
      "code": 6010,
      "name": "IncorrectEntrantAccount",
      "msg": "Account has incorrect entrant"
    },
    {
      "code": 6011,
      "name": "InvalidStartTime",
      "msg": "Wrong start time"
    },
    {
      "code": 6012,
      "name": "IncorrectBettingTime",
      "msg": "Current time is not possible to bet"
    },
    {
      "code": 6013,
      "name": "GameAlreadyFinished",
      "msg": "This game is already over"
    },
    {
      "code": 6014,
      "name": "PermissionDenied",
      "msg": "Permission denied"
    },
    {
      "code": 6015,
      "name": "NotClosableGameFromUser",
      "msg": "Not a closable game (From User)"
    },
    {
      "code": 6016,
      "name": "NotClosableGameFromTime",
      "msg": "Not a closable game (From Time)"
    },
    {
      "code": 6017,
      "name": "NotClosableGameFromFinish",
      "msg": "Not a closable game (From Finish)"
    },
    {
      "code": 6018,
      "name": "NumericOverflowError"
    }
  ]
};

export const IDL: ChartGame = {
  "version": "0.1.0",
  "name": "chart_game",
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
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "managerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "changeAuthority",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "changeManager",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newManager",
          "type": {
            "option": "publicKey"
          }
        }
      ]
    },
    {
      "name": "initGame",
      "accounts": [
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "afterGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topPlayersAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recentlyGamesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
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
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "afterStartTime",
          "type": "i64"
        },
        {
          "name": "afterEndTime",
          "type": "i64"
        },
        {
          "name": "timeCorrection",
          "type": "i64"
        }
      ]
    },
    {
      "name": "betGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "betData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
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
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "betDirection",
          "type": {
            "defined": "BetDirection"
          }
        },
        {
          "name": "betAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "beforeGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "afterGameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recentlyGamesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
      "args": [
        {
          "name": "beforeStartTime",
          "type": "i64"
        },
        {
          "name": "beforeEndTime",
          "type": "i64"
        },
        {
          "name": "beforeOpenPrice",
          "type": "u64"
        },
        {
          "name": "beforeClosePrice",
          "type": "u64"
        },
        {
          "name": "currentStartTime",
          "type": "i64"
        },
        {
          "name": "currentEndTime",
          "type": "i64"
        },
        {
          "name": "afterStartTime",
          "type": "i64"
        },
        {
          "name": "afterEndTime",
          "type": "i64"
        },
        {
          "name": "timeCorrection",
          "type": "i64"
        }
      ]
    },
    {
      "name": "claimPrize",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entrants",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "topPlayersAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "modifyGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        },
        {
          "name": "newStartTime",
          "type": "i64"
        },
        {
          "name": "newEndTime",
          "type": "i64"
        }
      ]
    },
    {
      "name": "closeGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gameData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalConfigData",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "startTime",
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalConfigData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "managerAccount",
            "type": "publicKey"
          },
          {
            "name": "gameCount",
            "type": "u128"
          },
          {
            "name": "gameState",
            "type": {
              "option": {
                "defined": "GameState"
              }
            }
          },
          {
            "name": "beforeStartTime",
            "type": "i64"
          },
          {
            "name": "beforeEndTime",
            "type": "i64"
          },
          {
            "name": "currentStartTime",
            "type": "i64"
          },
          {
            "name": "currentEndTime",
            "type": "i64"
          },
          {
            "name": "afterStartTime",
            "type": "i64"
          },
          {
            "name": "afterEndTime",
            "type": "i64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "blockTime",
            "type": "i64"
          },
          {
            "name": "timePerSlot",
            "type": "i64"
          },
          {
            "name": "timeCorrection",
            "type": "i64"
          },
          {
            "name": "timeCorrectionPerSlot",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "gameData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "betPeriod",
            "type": "i64"
          },
          {
            "name": "openPrice",
            "type": "u64"
          },
          {
            "name": "closePrice",
            "type": "u64"
          },
          {
            "name": "longBetAmount",
            "type": "u64"
          },
          {
            "name": "longBetCount",
            "type": "u32"
          },
          {
            "name": "shortBetAmount",
            "type": "u64"
          },
          {
            "name": "shortBetCount",
            "type": "u32"
          },
          {
            "name": "claimPrizeCount",
            "type": "u64"
          },
          {
            "name": "maxLongBetAmount",
            "type": "u64"
          },
          {
            "name": "maxShortBetAmount",
            "type": "u64"
          },
          {
            "name": "finish",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "betData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "betDirection",
            "type": {
              "option": {
                "defined": "BetDirection"
              }
            }
          },
          {
            "name": "betAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "countWin",
            "type": "u32"
          },
          {
            "name": "countLose",
            "type": "u32"
          },
          {
            "name": "countDraw",
            "type": "u32"
          },
          {
            "name": "countBet",
            "type": "u32"
          },
          {
            "name": "countGame",
            "type": "u32"
          },
          {
            "name": "totalBet",
            "type": "u128"
          },
          {
            "name": "totalLongBet",
            "type": "u128"
          },
          {
            "name": "totalShortBet",
            "type": "u128"
          },
          {
            "name": "totalClaim",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "userEntrantData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "front",
            "type": "u32"
          },
          {
            "name": "rear",
            "type": "u32"
          },
          {
            "name": "entrantsQueue",
            "type": {
              "array": [
                "publicKey",
                6
              ]
            }
          }
        ]
      }
    },
    {
      "name": "topPlayers",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "array": [
                {
                  "defined": "TopPlayer"
                },
                20
              ]
            }
          }
        ]
      }
    },
    {
      "name": "recentlyGames",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "front",
            "type": "u32"
          },
          {
            "name": "rear",
            "type": "u32"
          },
          {
            "name": "queue",
            "type": {
              "array": [
                {
                  "defined": "GameSummary"
                },
                16
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "TopPlayer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "account",
            "type": "publicKey"
          },
          {
            "name": "prize",
            "type": "u128"
          },
          {
            "name": "countWin",
            "type": "u32"
          },
          {
            "name": "countLose",
            "type": "u32"
          },
          {
            "name": "countDraw",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "GameSummary",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "longBetAmount",
            "type": "u64"
          },
          {
            "name": "longBetCount",
            "type": "u32"
          },
          {
            "name": "shortBetAmount",
            "type": "u64"
          },
          {
            "name": "shortBetCount",
            "type": "u32"
          },
          {
            "name": "changed",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "OnGoing"
          },
          {
            "name": "Pausing"
          }
        ]
      }
    },
    {
      "name": "BetDirection",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "LONG"
          },
          {
            "name": "SHORT"
          }
        ]
      }
    },
    {
      "name": "GameResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "LONG"
          },
          {
            "name": "SHORT"
          },
          {
            "name": "DRAW"
          },
          {
            "name": "CANCEL"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "GameChanged",
      "fields": [
        {
          "name": "beforeStartTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "beforeEndTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "currentStartTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "currentEndTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "afterStartTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "afterEndTime",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "GameUpdated",
      "fields": [
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "betPeriod",
          "type": "i64",
          "index": false
        },
        {
          "name": "openPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "closePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "longBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "longBetCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "shortBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "shortBetCount",
          "type": "u32",
          "index": false
        },
        {
          "name": "maxLongBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "maxShortBetAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "finish",
          "type": "bool",
          "index": false
        }
      ]
    },
    {
      "name": "UserBet",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "betDirection",
          "type": {
            "option": {
              "defined": "BetDirection"
            }
          },
          "index": false
        },
        {
          "name": "betAmount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "UserClaim",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "startTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "endTime",
          "type": "i64",
          "index": false
        },
        {
          "name": "betAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "divideRate",
          "type": "u64",
          "index": false
        }
      ]
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
      "name": "IncorrectManager",
      "msg": "Account has incorrect manager!"
    },
    {
      "code": 6003,
      "name": "InvalidBetDirection",
      "msg": "BetDirection must be one-way"
    },
    {
      "code": 6004,
      "name": "InvalidBetAmount",
      "msg": "Amount must be positive"
    },
    {
      "code": 6005,
      "name": "EntrantsQueueIsFull",
      "msg": "Entrants queue is full. Claim prize first"
    },
    {
      "code": 6006,
      "name": "EntrantsQueueIsEmpty",
      "msg": "Entrants queue is empty"
    },
    {
      "code": 6007,
      "name": "IncorrectAccountsLength",
      "msg": "Incorrect length of accounts"
    },
    {
      "code": 6008,
      "name": "IncorrectClaimAccount",
      "msg": "Account for claim is incorrect"
    },
    {
      "code": 6009,
      "name": "IncorrectClaimAccounts",
      "msg": "Accounts for claim is incorrect"
    },
    {
      "code": 6010,
      "name": "IncorrectEntrantAccount",
      "msg": "Account has incorrect entrant"
    },
    {
      "code": 6011,
      "name": "InvalidStartTime",
      "msg": "Wrong start time"
    },
    {
      "code": 6012,
      "name": "IncorrectBettingTime",
      "msg": "Current time is not possible to bet"
    },
    {
      "code": 6013,
      "name": "GameAlreadyFinished",
      "msg": "This game is already over"
    },
    {
      "code": 6014,
      "name": "PermissionDenied",
      "msg": "Permission denied"
    },
    {
      "code": 6015,
      "name": "NotClosableGameFromUser",
      "msg": "Not a closable game (From User)"
    },
    {
      "code": 6016,
      "name": "NotClosableGameFromTime",
      "msg": "Not a closable game (From Time)"
    },
    {
      "code": 6017,
      "name": "NotClosableGameFromFinish",
      "msg": "Not a closable game (From Finish)"
    },
    {
      "code": 6018,
      "name": "NumericOverflowError"
    }
  ]
};
