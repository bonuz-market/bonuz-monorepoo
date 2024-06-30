import { run } from 'hardhat'

const verify = async (contractAddress: string, arguments_: any[], contract?: string) => {
  console.log('Verifying contract...')

  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: arguments_,
      ...(contract && {
        contract: contract
      })
    })
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes('already verified')) {
      console.log('Already verified!')
    } else {
      console.log(error)
    }
  }
}

export default verify
