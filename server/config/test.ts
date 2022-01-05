export default {
  port: process.env.PORT || 1029,
  dbUri: process.env.DBURI,
  accessTokenTtl: "15m",
  refreshTokenTtl: "1y",
  saltWorkFactor: process.env.SALT || 10,
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFo3fFO9ZWJFHatz0RF1s3BYabSO
ot/3qYUjFzbBkYW/sFz+jII3cnxppTZxCx1CjJbxG59wlI8DWQCPd0kdmL/jdwAR
ox8t7OnEJmGObxD82B47t/WDEudCf9ldDkm6KyLhkvClAE/pLz3dTxdyMm9XCPnn
CpOvwmoKvMX6OmH5AgMBAAE=
-----END PUBLIC KEY-----`,
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgFo3fFO9ZWJFHatz0RF1s3BYabSOot/3qYUjFzbBkYW/sFz+jII3
cnxppTZxCx1CjJbxG59wlI8DWQCPd0kdmL/jdwARox8t7OnEJmGObxD82B47t/WD
EudCf9ldDkm6KyLhkvClAE/pLz3dTxdyMm9XCPnnCpOvwmoKvMX6OmH5AgMBAAEC
gYAdHmWZnbr4gfh2m3YynXviWhccOSGnCogDufTHLqkqs1lYWqy9Zuoj7/FsZgZB
VnaMTZwt1SeOFXWHsca9qbjga7m9mY/DAzJQn/bxsu2TV5mDXK0Ow9pNU3zBhBhS
J7DF4nyBr/T/p2vA3BcWsDlsrxEGvVw1WdQLRUAqAM97UQJBAK0ejfe4ru3tu95l
Mr775aoM3ag2mIwqDdRCgkubX0v91bYm6f9QsOOnarTRNS7fzSorDKbBBlsE4CNt
q+Gcpz0CQQCFaGqz/F389Us65kfNm2TeJEDHlquCb6q0yG6MZe1MaZN4ACfyd4Hs
LvRIuIWtNFexFosudhR3AmMyYuwk3rFtAkEAk9OVcsTXSwBH/h33+TFr6YtW8z67
gGSgrnGkhR9FfsRf60zLX2LtyVe6PHCwszgUHz/na7VD0hEVu+r4bIyyGQJABVAd
P8HDNHnIXzYgke2oXLhw5AH6Hp233K9Gx8yfYLWrq9HFxYBA6lkMXYELwdQd0e2l
6VnGgt7TeIQ8B1PfGQJAQOFws4QB8W+zVxz8KhBEg5BVDUyaaHLA5jVdH5a1qupV
Q1wwlhtNEGPFff5n/uMh4eSsnMq4oyWFXPG5zOQx/g==
-----END RSA PRIVATE KEY-----`,
};
