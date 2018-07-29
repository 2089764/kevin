# Go util

Simple utility for extracting a JSON representation of the declarations in a 
Go source file.

## Installing

```bash
go get -u github.com/2089764/kevin/go/kenFunc/
```

## Using
```bash
> b2 := []byte("您输入的是 ")
> b3 := util.Bytes2Combine(b2,data)
> b3 := util.BytesCombine(b2,data)
[{"label":"proc","type":"package",<...>}]
```

