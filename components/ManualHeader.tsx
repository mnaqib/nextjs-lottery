import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'

const ManualHeader: React.FC = () => {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return

        if (localStorage.getItem('connected')) enableWeb3()
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged(async (account) => {
            if (!account) {
                localStorage.removeItem('connected')
                await deactivateWeb3()
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to{' '}
                    {`${account.slice(0, 6)}....${account.slice(
                        account.length - 4
                    )}`}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        localStorage.setItem('connected', 'injected')
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader
