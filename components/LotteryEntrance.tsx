import React, { useEffect, useState } from 'react'
import { useWeb3Contract, useMoralis } from 'react-moralis'
import contract from '../constants'
import { ContractTransaction, ethers } from 'ethers'
import { useNotification } from 'web3uikit'

const { contractAbi: abi, contractAddresses } = contract

const LotteryEntrance: React.FC = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex as string).toString()
    const raffleAddress =
        chainId in contractAddresses
            ? (contractAddresses as any)[chainId][0]
            : null

    const [entranceFee, setEntranceFee] = useState('')
    const [numPlayers, setNumPlayers] = useState(0)
    const [recentWinner, setRecentWinner] = useState('')

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'enterRaffle',
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getEntranceFee',
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getNumberOfPlayers',
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: 'getRecentWinner',
    })

    const updateUI = async () => {
        if (isWeb3Enabled) {
            const entranceFee = ((await getEntranceFee()) as any).toString()
            const numPlayers = ((await getNumberOfPlayers()) as any).toNumber()
            const recentWinner = (await getRecentWinner()) as string

            setNumPlayers(numPlayers)
            setRecentWinner(recentWinner)
            setEntranceFee(entranceFee)
            console.log({ entranceFee })
        }
    }

    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])

    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = (tx: ContractTransaction) => {
        dispatch({
            type: 'info',
            message: 'Transaction completed',
            title: 'Tx notification',
            position: 'topR',
        })
    }

    return (
        <div className="flex flex-col font-semibold px-8 gap-2">
            <p className="text-2xl mb-6">Lottery Entrance</p>
            {raffleAddress ? (
                <div className="flex flex-col">
                    <div className="flex items-center gap-6 mb-4">
                        <p>
                            Entrance Fee:
                            {entranceFee
                                ? ethers.utils.formatUnits(entranceFee, 'ether')
                                : entranceFee}{' '}
                            ETH
                        </p>
                        {isLoading || isFetching ? (
                            <div className="animate-spin h-8 w-8 border-2 rounded-full spinner-border text-blue-400" />
                        ) : (
                            <button
                                className="bg-blue-400 rounded px-4 py-2 text-white font-semibold hover:scale-105 w-28 text-sm"
                                onClick={async () => {
                                    await enterRaffle({
                                        onSuccess: (tx) =>
                                            handleSuccess(
                                                tx as ContractTransaction
                                            ),
                                        onError: (error) =>
                                            console.error(error),
                                    })
                                }}
                                disabled={isLoading || isFetching}
                            >
                                Enter Raffle
                            </button>
                        )}
                    </div>

                    <div>
                        <p>Number of Players: {numPlayers}</p>
                        <p>Recent Winner: {recentWinner}</p>
                    </div>
                </div>
            ) : (
                <div>No RaffleAddress detected</div>
            )}
        </div>
    )
}

export default LotteryEntrance
