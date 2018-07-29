package Util

import "bytes"

func BytesCombine(pBytes ...[]byte) []byte {
	return bytes.Join(pBytes, []byte(""))
}

func Bytes2Combine(pBytes1 []byte,pBytes2 []byte) []byte{
	var buffer bytes.Buffer //Buffer是一个实现了读写方法的可变大小的字节缓冲
	buffer.Write(pBytes1)
	buffer.Write(pBytes2)
	b3 :=buffer.Bytes()
	return b3
}


