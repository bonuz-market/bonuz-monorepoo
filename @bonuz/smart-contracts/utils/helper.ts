import fs from 'fs'
import { ethers } from 'hardhat'

export const tokens = (n: string | number) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
  // return ethers.utils.parseUnits(n.toString(), 'wei')
}

// ----------------------------------------------------------------

export const createJsonFile = (fileName: string, jsonData: any) => {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(fileName, JSON.stringify(jsonData))
  } catch {
    //
  }
}

// ----------------------------------------------------------------

export const getBalance = async (address: string) => {
  return await ethers.provider.getBalance(address)
}
