import React from 'react'
import { ConnectButton } from 'web3uikit'

const Header: React.FC = () => {
    return (
        <div className="flex items-center justify-between p-4 border-b mb-4">
            <h1 className="text-3xl font-bold">Decentralized Lottery</h1>
            <ConnectButton moralisAuth={false} />
        </div>
    )
}

export default Header
