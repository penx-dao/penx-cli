import crypto from 'crypto'

export async function calculateSHA256FromBuffer(buffer: Buffer): Promise<string> {
  const hashBuffer: ArrayBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray: Uint8Array = new Uint8Array(hashBuffer)
  const hashHex: string = Array.from(hashArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}
