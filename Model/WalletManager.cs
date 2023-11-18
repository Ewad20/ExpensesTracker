using System;
using System.Collections.Generic;

namespace _2023pz_trrepo.Model
{
     public class WalletManager
    {
        public List<Wallet> Wallets { get; set; }

        public WalletManager()
        {
            Wallets = new List<Wallet>();
        }

        public void AddWallet(Wallet wallet)
        {
            Wallets.Add(wallet);
        }

        public Wallet CreateWallet(string walletName)
        {
            var wallet = new Wallet(walletName);
            Wallets.Add(wallet);
            return wallet;
        }
    }
}
